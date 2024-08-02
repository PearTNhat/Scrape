const scrapeCategory = async (brower,url) => {
    try {
        let page = await brower.newPage();
        console.log('>> Mở trang web');
        // cái này là set kích thước màn hình
        // const screen = await page.evaluate(() => {
        //     return {
        //         width: window.screen.width,
        //         height: window.screen.height
        //     };
        // });

        // // Set viewport to fullscreen
        // await page.setViewport({
        //     width: screen.width,
        //     height: screen.height
        // });
        await page.goto(url);
        console.log('>> Đi tới url', url);
        await page.waitForSelector('#webpage');
        console.log('>> Chờ cho trang web load xong');
        // $$eval là hàm của puppeteer giống querySelectorAll
        // $eval là hàm của puppeteer giống querySelector
        const dataCategory = await page.$$eval('#navbar-menu > ul#menu-main-menu > li', (els)=>{
            return els.map(el => {
                // console ở đây sẻ hiện trên trinh duyệt
                return {
                    category:el.querySelector('a').textContent,
                    href : el.querySelector('a').href
                };
            });
        })
        await page.close();
        console.log('>> Đóng trang web');
        return dataCategory;
    } catch (error) {
        console.log('Lỗi ở scrape category ', error);
    }
}

const scraper = async (brower,url) => {
    try {
        const data = {}
        const page = await brower.newPage();
        console.log('>> Mở trang web');
        await page.goto(url);
        console.log('>> Đi tới url', url);
        // main là id bao body của trang web // chọn cái nào mà dễ lấy data là được
        const tag = "#main"
        await page.waitForSelector(tag);
        console.log('>> Chờ cho trang web load xong tag', tag);
        // lấy ra thẻ header 
        const headerData = await page.$eval('header', (el)=>{
            return{
                title: el.querySelector('h1').textContent,
                description: el.querySelector('p').textContent
            }
        })
        data.headerData = headerData;
        // trong trang này có những item để điều hướng tới trang khác ở đay là vào trang khác
        // vào các link dùng nó để mở ra trang mới
        const detailLink = await page.$$eval(".section.section-post-listing ul.post-listing.clearfix li", (els)=>{
            const data = els.map(el => {
                return {
                    href: el.querySelector('h3 a').href
                }
            })
            return data
        })
        // Khi vào trang mới Là trang mô tả sản phẩm
        // ta lấy chi tiết sản phẩm
        const scrapeDeatil = async (link) => {
            const newPage = await brower.newPage();
            await newPage.goto(link);
            console.log('>> Đi tới url', link);
            await newPage.waitForSelector('#main');
            const dataDetail ={}
            // lấy ímages
            const images = await newPage.$$eval('#left-col .post-images img', (els)=>{
                return els.map(el => {
                    return el.src;
                });
            });
            // lấy các thông  tin ở dưới images
            const headerDetail = await newPage.$eval('#left-col .page-header', (el)=>{
                return {
                    start: el.querySelector('span').className.match(/\d+/)[0],
                    title: el.querySelector('a').textContent,
                    address: el.querySelector('.post-address').textContent,
                    attrs:{
                        money: el.querySelector('.item.price span').textContent,
                        area: el.querySelector('.item.acreage span').textContent,
                        publish: el.querySelector('.item.published span').textContent,
                        tag: el.querySelector('.item.hashtag span').textContent,
                    }
                }
            })

            dataDetail.images= images;
            dataDetail.headerDetail = headerDetail;
            await newPage.close();
            return dataDetail;
        }
        const details=[];
        for(let link of detailLink){
           const detail = await scrapeDeatil(link.href);
            details.push(detail);
        }
        data.details = details;
        console.log('>> scrape xong ',url);
        return data;
    } catch (error) {
        console.log('Lỗi ở scraper', error);
        throw new Error (error);
    }
}
module.exports={
    scrapeCategory,
    scraper
}