const startBrowser  = require('./brower');
const scrapeController = require('./scrapeController');
// khởi tạo brower
const brower = startBrowser();
scrapeController(brower);