// A separate data layer. This layer will interact with db and could be imported in the service layer to be used as a database adaptor.
// Then in case of a db swap, just the adaptor has to be re-implemented  without even touching the rest of the application.
