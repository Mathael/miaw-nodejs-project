module.exports = {
    COMMONS : {
        CON_STATE : {
            SUCCESS : 'CON_STATE_SUCCESS'
        },
        FAIL : 'CON_STATE_FAIL'
    },
    TO_CLIENT : {
        GENERAL: {
            NEW_USER_COUNT : 'GENERAL_NEW_USER_COUNT'
        },
        ROOM : {
            GET_ALL : 'EVENT_ROOM_GET_ALL',
            JOIN : 'EVENT_ROOM_JOIN',
            JOIN_SUCCESS : 'EVENT_ROOM_JOIN_SUCCESS',
            CREATE : 'EVENT_ROOM_CREATE',
            INFORMATIONS : 'INFORMATIONS',
            LOCK_STATE : 'EVENT_ROOM_LOCK_STATE',
        }
    },
    TO_SERVER : {
        ROOM : {
            GET_ALL : 'EVENT_ROOM_GET_ALL',
            GET_MY_ROOM_INFORMATIONS : 'GET_MY_ROOM_INFORMATIONS',
            JOIN : 'EVENT_ROOM_JOIN',
            CREATE : 'EVENT_ROOM_CREATE',
            UNLOCK : 'EVENT_ROOM_UNLOCK',
            LOCK : 'EVENT_ROOM_LOCK'
        }
    }
};
