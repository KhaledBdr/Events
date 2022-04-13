const Event = require('./Event.model')


module.exports.viewAllEvents = (id , query , status)=>{
    if(query == undefined || query.skip == -5){
        query = {
            limit : 5,
            skip : 0
        }
    }
    return new Promise((resolve , reject)=>{
        if(status == 'all'){
        Event.find({userId : id})
        .limit(query.limit)
        .skip(query.skip)
        .sort('date')
        .then(result=>{
            resolve(result)
        }).catch(err=>{
            reject(err)
            console.log(err.message);
        })
    }else if(status == 'today'){
        let todayDate = new Date(Date.now());
        let todayD = new Date(`${todayDate.getMonth()+1}/${todayDate.getDate()}/${todayDate.getFullYear()}`)

        let tomorrow = new Date(`${todayDate.getMonth()+1}/${todayDate.getDate() + 1}/${todayDate.getFullYear()}`)
        Event.find({userId : id ,
                      date : {$gt: todayD ,
                             $lt: tomorrow }})
            .sort('date')
            .then(result=>{
                resolve(result)
            }).catch(err=>{
                reject(err)
                console.log(err.message);
            })

    }
    else{
        
        var todayDate = new Date(Date.now());
        todayDate.setHours(0, 0, 0, 0);

        Event.find({userId : id , date : {$lt: todayDate}})
        .limit(query.limit)
        .skip(query.skip)
        .sort('date')
        .then(result=>{
            resolve(result)
        }).catch(err=>{
            reject(err)
            console.log(err.message);
        })
    }
    })

}

module.exports.viewOneEvent = (id)=>{
      return new Promise((resolve , reject)=>{
        Event.findById(id).then(result=>{
            resolve(result)
        }).catch(err=>{
            reject(err)
            console.log(err.message);
        })
    })
}

module.exports.deleteEvent = (id)=>{
    return new Promise((resolve , reject)=>{
        Event.findByIdAndDelete(id)
            .then(result =>{
                resolve('deleted successfully');
            })
            .catch(err=>{
                reject(err)
            })
    })
}

module.exports.createEvent = (data)=>{
    return new Promise((resolve , reject)=>{
        const newEvent = new Event({
            userId : data.user_id,
            title:data.title,
            description:data.description,
            location: data.location,
            date: data.date
        })
        newEvent.save()
        .then(result=>{
            resolve(result)
        }).catch(err=>{
            reject(err)
        })
    })
}

module.exports.getEditEventDetails = (id)=>{
    return new Promise((resolve , reject)=>{
        Event.findById(id).then(result=>{
            resolve(result)
        }).catch(err=>{
            reject(err)
            console.log(err.message);
        })
    })
}