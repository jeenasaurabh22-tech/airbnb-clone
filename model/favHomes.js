const fs = require('fs');
const path = require('path');
const rootDir = require('../utils/pathUtil');
const favPath=path.join(rootDir, 'data', 'favourites.json');

module.exports = class Favourite {
    
    static getFavourites(callback){
       fs.readFile(favPath,(err,data)=>{
        if (err||!data||data.length===0) {
           callback([]);
           return;
        }
        callback(JSON.parse(data));
       });
    }
    static addFavourites(homeId,callback) {
        Favourite.getFavourites((favourites)=>{
            if(favourites.includes(homeId)) {
                if(callback) callback();
                return;
            }
            favourites.push(homeId);
            fs.writeFile(favPath, JSON.stringify(favourites, null, 2), (err) => {
                if (err) {
                    console.log('Error writing favourites file:', err);
                }
                if (callback) callback();
            });
        });
    }

}