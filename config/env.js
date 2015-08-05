
// environment variable module

var e = process.env;

module.exports = {
	accessKey: e.CHURN_SCRAPER_ACCESS_KEY,
	port: e.CHURN_SCRAPER_PORT || 3000,
	DB: {
		location: e.CHURN_SCRAPER_DB_LOCATION || 'mongodb://localhost:27017'
	}
};