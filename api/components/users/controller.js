const { nanoid } = require('nanoid');
const auth = require('../auth');

module.exports = function(injectedStore, injectedCache) {
    const store = injectedStore || require('./../../../store/dummy');
    const cache = injectedCache || require('./../../../store/dummy'); 
    const TABLE = 'user';
    
    async function list() {
        const usersCache = await cache.list(TABLE);

        if (!usersCache) {
            return store.list(TABLE);
        }
        
        return usersCache;
    }
    
    function get(id) {
        return store.get(TABLE, id);
    }
    
    async function add(data) {
        const newUser = {
            id: nanoid(),
            ...data,
        }

        await auth.add({
            id: newUser.id,
            username: newUser.username,
            password: newUser.password,
        });

        delete newUser.password;

        return store.add(TABLE, newUser);
    }

    async function follow(from, to) {
        return store.add(TABLE + '_follow', {
            user_from: from,
            user_to: to,
        });
    }
    
    function followers(userId) {
        const join = {};
        join[TABLE] = 'user_from';
        
        return store.query(TABLE + '_follow', {
            user_to: userId,
        }, join);
    }
    
    
    function following(userId) {
        
        const join = {};
        join[TABLE] = 'user_to';
        
        return store.query(TABLE + '_follow', {
            user_from: userId,
        }, join);
    }

    async function update(data, id) {
        const [ user ] = await get(id);
        const updatedUser = {
            ...user,
            ...data,
        }
        return store.update(TABLE, id, updatedUser);
    }

    function remove(id) {
        return store.remove(TABLE, id);
    }

    return {
        list,
        get,
        add,
        update,
        remove,
        follow,
        followers,
        following
    };
}