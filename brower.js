const puppeteer  = require("puppeteer");

const startBrowser = async () => {
    let browser 
    try {
        browser = await puppeteer.launch({
            // show ui Chromium true là k show , false là show
            headless: true,
            // chrome sử dụng các layer để chặn các web k tin cậy nên sử dụng cờ này để bỏ qua
            args: ["--disable-setuid-sandbox"],
            //Ignore HTTPS errors (e.g., self-signed certificates)
            'ignoreHTTPSErrors': true
        });
    } catch (error) {
        console.log('Khởi động brower thất bại: ', error);
        
    }
    // trong trường hợp k có brower thì sẽ trả về undefined
    return browser;
}
module.exports = startBrowser