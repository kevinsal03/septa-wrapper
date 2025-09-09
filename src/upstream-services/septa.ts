import {
  type DetailedRoute,
  FullRouteArraySchema,
} from "../types/septa/route.js";
import {
  type SeptaAlert,
  SeptaAlertArraySchema,
} from "../types/septa/alert.js";
import { type Trip, TripArraySchema } from "../types/septa/trip.js";

/**
 * Common base class for HTTP APIs
 */
abstract class BaseHttpApi {
  private readonly urlBase: URL;

  /**
   * Base constructor
   * @param urlBase the base of the SEPTA API being used
   */
  constructor(urlBase: URL) {
    this.urlBase = new URL(urlBase);
  }

  /**
   * Query the septa API and return JSON data
   * @param endpoint the endpoint from the base
   * @param method GET|POST
   * @param fetchOptions same as standard fetch
   * @protected
   */
  protected async query(
    endpoint: string,
    method: "GET" | "POST",
    fetchOptions?: Omit<Parameters<typeof fetch>[1], "method">,
  ): Promise<unknown> {
    const response = await this.queryRaw(endpoint, method, fetchOptions);

    let data: unknown;
    try {
      data = await response.json();
    } catch {
      throw new Error("Failed to parse JSON response from SEPTA.");
    }

    if (!data) {
      throw new Error("SEPTA returned no data.");
    }

    return data;
  }

  /**
   * Wraps the raw query to septa api.
   * @params see query(...)
   * @protected
   */
  protected async queryRaw(
    endpoint: string,
    method: "GET" | "POST",
    fetchOptions?: Omit<Parameters<typeof fetch>[1], "method">,
  ): Promise<Response> {
    const url = new URL(endpoint, this.urlBase);

    let response: Response;
    try {
      response = await fetch(url, { method, ...fetchOptions });
    } catch (err) {
      throw new Error(
        `Network error while calling ${url.toString()}: ${(err as Error).message}`,
      );
    }

    if (!response.ok) {
      throw new Error(
        `HTTP error ${response.status} (${response.statusText}) from ${url.toString()}`,
      );
    }
    return response;
  }
}

/**
 * Wraps the Septa Flat api. This returns semi static JSON data.
 * @baseUrl https://flat-api.septa.org
 */
class SeptaFlatAPI extends BaseHttpApi {
  /**
   *
   * @param urlBase Flat API base
   */
  constructor(urlBase: URL) {
    super(urlBase);
  }

  /**
   * Get all routes
   * @returns {DetailedRoute[]} - an array containing detailed routes
   */
  async getRoutes(): Promise<DetailedRoute[]> {
    const data = await this.query("routes.json", "GET");

    const routes = FullRouteArraySchema.parse(data);
    return [
      ...new Map(routes.map((route) => [route.route_id, route])).values(),
    ];
  }

  /**
   * Get information for a specific route
   * @param route_id {string} - based on the route Ids returned by getRoutes()
   */
  async getRoute(route_id: string): Promise<DetailedRoute | undefined> {
    return (await this.getRoutes()).find((route) => {
      return route.route_id == route_id;
    });
  }

  /**
   * Get all route IDs from the Flat API
   * @returns {string[]} of the route ids
   */
  async getAllRouteIds(): Promise<string[]> {
    const allRoutes = await this.getRoutes();
    return allRoutes.map<string>((route) => route.route_id);
  }
}

/**
 * Wraps the standard "Official" v1 and "private" v2 APIs
 * Preference was given to /v2/ endpoints when possible.
 * v2 is not documented by SEPTA, so its endpoints were reverse engineered from
 * the "new" SEPTA website.
 * @urlBase https://www3.septa.org/api
 * @versions v1, v2
 */
class SeptaStandardApi extends BaseHttpApi {
  /**
   * Get all active alerts for septa
   * @returns {SeptaAlert[]} - array of all septa alerts as returned from the API
   */
  async getAlerts(): Promise<SeptaAlert[]> {
    const data = await this.query("v2/alerts", "GET");

    return SeptaAlertArraySchema.parse(data);
  }

  /**
   * Get a specific alert
   * note: this calls getAlerts(), so if you need multiple alerts it's best to
   * call that directly
   * @param alert_id {string} a string representation of the Alert ID
   * @returns {Promise<SeptaAlert|undefined>} resolves to undefined if not found
   */
  async getAlert(alert_id: string): Promise<SeptaAlert | undefined> {
    return (await this.getAlerts()).find((alert) => {
      return alert.alert_id == alert_id;
    });
  }

  /**
   * Get all alerts for a specific route
   * note: this calls getAlerts, so if you need multiple routes call that
   * directly
   * @param route_id {string} representation of the route ID from getRoutes()
   * @return {SeptaAlert[]} empty if none are found
   */
  async getAlertsForRoute(route_id: string): Promise<SeptaAlert[]> {
    return (await this.getAlerts()).filter((alert) => {
      return alert.routes.includes(route_id);
    });
  }

  /**
   * Get all trips for the given route(s)
   * @param route_id_list Either a single route id, or comma separated list of route ids
   */
  async getTripsForRoute(route_id_list: string): Promise<Trip[]> {
    const data = await this.query(`v2/trips?route_id=${route_id_list}`, "GET");
    return TripArraySchema.parse(data);
  }
}

/**
 * Helper type to wrap both SeptaAPI versions in one object
 */
export type SeptaAPI = {
  std: SeptaStandardApi;
  flat: SeptaFlatAPI;
};

/**
 * Helper type as params for creating a septa API object
 */
export type SeptaAPIProps = {
  standardBase?: string | URL;
  flatBase?: string | URL;
};

/**
 * Default API values
 */
const defaultAPIProps: Required<SeptaAPIProps> = {
  standardBase: "https://www3.septa.org/api/",
  flatBase: "https://flat-api.septa.org/",
};

/**
 * Get access to a septa API instance
 * Store the returned object and reuse it.
 * @param userProps {SeptaAPIProps}
 * @returns {SeptaAPI} with new instances
 */
export function septaAPI(userProps?: SeptaAPIProps): SeptaAPI {
  const props = {
    ...defaultAPIProps,
    ...userProps,
  };

  // TODO: Manage so each call doesn't create and dispose an API instance?
  return {
    std: new SeptaStandardApi(new URL(props.standardBase)),
    flat: new SeptaFlatAPI(new URL(props.flatBase)),
  };
}
