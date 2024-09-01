const dgram = require('node:dgram')
const server = dgram.createSocket('udp4')
const packet = require('dns-packet')




const db = {
    'piyushgarg.dev' : {
        type : 'A',
        data : '1.2.3.4'
    },
    'abc.com' : {
        type : 'A',
        data : '5.4.3.8'
    },
    'ritik.com' : {
        type : 'CNAME',
        data : 'hashnode.network'
    },
}

server.on('message' , (msg , remoteInfo)=>{

    const incomingReq = packet.decode(msg) // gives you decoded req
    const findquery  =  db[incomingReq.questions[0].name]
    if (findquery){
       const res =  packet.encode({

            id : incomingReq.id,
            type : 'respone',
            flags : packet.AUTHORITATIVE_ANSWER,
            questions : incomingReq.questions,
            answers : [{
                type : findquery.type,
                class : 'IN',
                name : incomingReq.questions[0].name,
                data : findquery.data
            }]

        })

        server.send(res , remoteInfo.port , remoteInfo.address)
    }
    
})

PORT = 53
server.bind(PORT , ()=>{
    console.log('DNS Server is running on Port : ',PORT);
    
})