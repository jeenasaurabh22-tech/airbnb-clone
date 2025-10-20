const db=require('../utils/databaseUtil');
module.exports = class Favourite {
    
    static getFavourites(){
        return db.execute('SELECT f.id as favId, h.* FROM favourites f JOIN homes h ON f.home_id = h.id');
    }
    static removeFavourites(homeId) {
        return db.execute('DELETE FROM favourites WHERE home_id = ?', [homeId]);
        
    }
    static async  addFavourites(homeId) {
        const [favHomes] = await db.execute('SELECT * FROM homes WHERE id = ?', [homeId]);

        if(favHomes.length==0){
            return { message: 'Home does not exist' };

        }
        
        const [favRows] = await db.execute(
        'SELECT * FROM favourites WHERE user_id = ? AND home_id = ?',
        [1, homeId]
    )
    if (favRows.length > 0) {
        return { message: 'Home is already in favourites' };
    }
        await db.execute('INSERT INTO favourites (name,home_id) VALUES (?,?)', [favHomes[0].houseName, homeId]);
        return { message: 'Home added to favourites successfully' };
       
    }

}