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
            CREATE : 'EVENT_ROOM_CREATE'
        },
        PROF :{
            START : 'EVENT_PROF_START',
            STOP :'EVENT_PROF_STOP',
            SHOWSTAT : 'EVENT_PROF_STAT',
            NEXT : 'EVENT_PROF_NEXT'
        }
    },
    TO_SERVER : {
        ROOM : {
            GET_ALL : 'EVENT_ROOM_GET_ALL',
            JOIN : 'EVENT_ROOM_JOIN',
            CREATE : 'EVENT_ROOM_CREATE'
        },
        PROF :{
            START : 'EVENT_PROF_START',
            STOP :'EVENT_PROF_STOP',
            SHOWSTAT : 'EVENT_PROF_STAT',
            NEXT : 'EVENT_PROF_NEXT'
        }
    }
};
