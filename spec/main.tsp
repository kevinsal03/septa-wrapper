import "@typespec/http";

using Http;
@service(#{ title: "A better way of using the SEPTA API" })
@server("http://localhost:3000")
namespace SeptaAPIWrapper;
/**
 * Type of route.
 */
enum RouteType {
  TROLLEY: 0,
  SUBWAY: 1,
  REGIONAL_RAIL: 2,
  BUS: 3,
  TRACKLESS_TROLLEY: 11,
}

/**
 * A document associated with a route.
 */
model RouteDocument {
  type: string;
  title: string;
  url: string;
  linkLabel: string;
}

/**
 * Detailed information about a specific route.
 */
model DetailedRoute {
  route_id: string;
  route_long_name: string;
  route_short_name: string;
  route_type: RouteType;
  route_color: string;
  route_text_color: string;
  route_color_dark: string;
  route_color_text_dark: string;
  route_frequency_text: string;
  is_frequent_bus: boolean;
}

/**
 * Fool model for a transit route, including documents.
 */
model FullRoute extends DetailedRoute {
  documents: RouteDocument[];
}

/**
 * alias for an array of FullRoute
 */
alias FullRouteArray = FullRoute[];


/**
 * The real-time status of a trip.
 */
enum TripStatus {
  "ON-TIME",
  LATE,
  EARLY,
  "NO GPS",
  CANCELED,
}

/**
 * The real-time data for a single trip.
 */
model Trip {
  // --- Common Fields ---
  route_id: string;
  trip_id: string;
  trip_headsign: string;
  direction_id: int32;

  /**
   * Represents the block ID. String for Regional Rail or number for Bus/Trolley.
   */
  block_id: string | int32;

  delay: int32;
  status: TripStatus;
  lat: string | null;
  lon: string | null;

  /**
   * Represents the block ID. String for Regional Rail or number for Bus/Trolley.
   */
  heading: string | int32 | null;

  next_stop_id: string | int32 | null;
  next_stop_name: string | null;
  next_stop_sequence: int32 | null;
  seat_availability: string | null;

  /**
   * The vehicle ID. Can be "None", a single ID, or a comma-separated list of IDs.
   */
  vehicle_id: string | null;

  /**
   * The timestamp of the last update, represented as a Unix timestamp.
   */
  timestamp: int64;

  // --- Regional Rail Fields ---
  service_id?: string;

  start_time?: string;

  end_time?: string;

  // --- Bus/Trolley Fields ---
  trip_completion?: string | null;

  transit_date?: string;

  direction_name?: string;
}

/**
 * Alias for an array of Trip models.
 */
alias TripArray = Trip[];

/**
 * The type of alert.
 */
enum AlertType {
  ADVISORY,
  ALERT,
  DETOUR,
}

/**
 * Current status of the alert.
 */
enum AlertStatus {
  NORMAL,
  SUSPENDED,
}

/**
 * The cause of the alert.
 */
enum AlertCause {
  OTHER_CAUSE,
  CONSTRUCTION,
  MAINTENANCE,
  UNKNOWN_CAUSE,
  TECHNICAL_PROBLEM,
  POLICE_ACTIVITY,
}

/**
 * The effect of the alert
 */
enum AlertEffect {
  MODIFIED_SERVICE,
  NO_SERVICE,
  ACCESSIBILITY_ISSUE,
  OTHER_EFFECT,
  UNKNOWN_EFFECT,
  REDUCED_SERVICE,
  DETOUR,
  ADDITIONAL_SERVICE,
}

/**
 * The severity level of the alert.
 */
enum AlertSeverity {
  SEVERE,
  INFO,
  UNKNOWN_SEVERITY,
  WARNING,
}

/**
 * a single SEPTA alert object.
 */
model SeptaAlert {
  alert_id: string;
  routes: string[];
  type: AlertType;
  subject: string | null;
  message: string;
  status: AlertStatus;
  cause: AlertCause;
  effect: AlertEffect;
  severity: AlertSeverity;
  trains: string[];
  blocks: unknown[];
  trips: unknown[];
  stops: unknown[];
  start: string;
  end: string | null;
}

alias SeptaAlertArray = SeptaAlert[];

@tag("Alerts")
@route("/alerts")
interface Alerts {
  /**
   * Get a list of all current SEPTA alerts.
   * @returns An array of SEPTA alerts.
   */
  @get
  @route("/")
  list(): {
    @statusCode _: 200;
    @body body: SeptaAlertArray;
  };

  /**
   * Get a specific SEPTA alert by its ID.
   * @param alert_id The id for the alert.
   * @returns The requested SEPTA alert.
   */
  @get
  @route("/{alert_id}")
  getById(
    @path
    alert_id: string
  ): {
    @statusCode _: 200;
    @body body: SeptaAlert;
  };
}

@tag("Routes")
@route("/routes")
interface Routes {
  /**
   * Get a list of all SEPTA routes.
   * @returns An array of detailed route information.
   */
  @get
  @route("/")
  list(): {
    @statusCode _: 200;
    @body body: FullRouteArray;
  };

  /**
   * Get a specific SEPTA route by its ID.
   * @param route_id The unique identifier for the route (e.g., "L1", "47", "NOR").
   * @returns The requested route object, or an empty object if not found.
   */
  @get
  @route("/{route_id}")
  getById(
    @path
    route_id: string
  ): {
    @statusCode _: 200;
    @body body: DetailedRoute;
  } | {
    @statusCode _: 201; // Reflects the `ctx.status(201)` from the Hono code
    @body body: {};
  };

  /**
   * Get all active alerts for a specific SEPTA route.
   * @param route_id The unique identifier for the route.
   * @returns An array of alerts pertaining to the specified route.
   */
  @get
  @route("/{route_id}/alerts")
  listAlertsForRoute(
    @path
    route_id: string
  ): {
    @statusCode _: 200;
    @body body: SeptaAlertArray;
  };

  /**
   * Get all active trips for a specific SEPTA route.
   * @param route_id The unique id for the route.
   * @returns An array of real-time trip data for the id route.
   */
  @get
  @route("/{route_id}/trips")
  listTripsForRoute(
    @path
    route_id: string
  ): {
    @statusCode _: 200;
    @body body: TripArray;
  };
}

@tag("Trips")
@route("/trips")
interface Trips {
  /**
   * Get a list of all active trips across all SEPTA routes.
   * @returns An array of real-time trip data.
   */
  @get
  @route("/")
  listAll(): {
    @statusCode _: 200;
    @body body: TripArray;
  };
}