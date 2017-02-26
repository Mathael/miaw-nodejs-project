module.exports = {
    COMMONS : {
        CON_STATE : {
            SUCCESS : 'CON_STATE_SUCCESS'
        },
        FAIL : 'CON_STATE_FAIL',
        APROPOS : 'EVENT_APROPOS'
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
            GET_MY_ROOM_INFORMATIONS : 'GET_MY_ROOM_INFORMATIONS',
            LOCK_STATE : 'EVENT_ROOM_LOCK_STATE',
            LEAVE : 'EVENT_ROOM_LEAVE',
            UPDATE_DATA : 'UPDATE_DATA',
            COMMANDER : {
                QUESTION_LIST : 'EVENT_ROOM_COMMANDER_QUESTION_LIST'
            }
        },
        TEACHER :{
            STOP :'EVENT_TEACHER_STOP',
            SHOW_STAT : 'EVENT_TEACHER_STAT',
            NEXT : 'EVENT_TEACHER_NEXT',
            NEW_ANSWER_PUSHED : 'EVENT_TEACHER_NEW_ANSWER_PUSHED'
        },
        STUDENT : {
            WAIT : 'EVENT_WAIT_NEXTQUESTION'
        },
        QUESTION : {
            LIST : 'EVENT_QUESTION_LIST',
            SHOW : 'EVENT_QUESTION_SHOW'
        }
    },
    TO_SERVER : {
        ROOM : {
            GET_ALL : 'EVENT_ROOM_GET_ALL',
            GET_MY_ROOM_INFORMATIONS : 'GET_MY_ROOM_INFORMATIONS',
            JOIN : 'EVENT_ROOM_JOIN',
            CREATE : 'EVENT_ROOM_CREATE',
            DELETE : 'EVENT_ROOM_DELETE',
            UNLOCK : 'EVENT_ROOM_UNLOCK',
            LOCK : 'EVENT_ROOM_LOCK',
            LEAVE : 'EVENT_ROOM_LEAVE',
            EXPEL : 'EVENT_ROOM_EXPEL'
        },
        TEACHER :{
            START : 'EVENT_TEACHER_START',
            STOP :'EVENT_TEACHER_STOP',
            SHOW_STAT : 'EVENT_TEACHER_STAT',
            NEXT : 'EVENT_TEACHER_NEXT'
        },
        STUDENT : {
            SEND_ANSWER : 'EVENT_STUDENT_SENDANSWER'
        }
    }
};
