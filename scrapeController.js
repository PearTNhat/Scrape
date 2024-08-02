const scrapes = require('./scraper');
const fs = require('fs');
const scrapeController = async (browerInstance) =>{
    const url = 'https://phongtro123.com/';
    const indexs =[1,2,3,4] // muốn vào category của 4 index này
    try {
        let browser =await browerInstance
        let categories =await scrapes.scrapeCategory(browser,url);
        // lấy [1,2,3,4] category
        const selectedCategories = categories.filter((el,index) => indexs.includes(index));
        const data = await scrapes.scraper(browser,selectedCategories[0].href);
        fs.writeFile('choThuePhongTro.json',JSON.stringify(data),(err)=>{
            if(err) {
                console.log('Lỗi khi ghi file choThuePhongTro.json', err);
                throw err;
            };
            console.log('Đã lưu file data.json');
        });
        // các category còn lại thì có thể coppy và cho chạy or nếu khác thì viết hàm để chạy lại
    } catch (error) {
        console.log('Lỗi ở scrapeController', error);
    }
}
module.exports = scrapeController;