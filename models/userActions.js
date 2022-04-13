const { userModel, User } = require("./User.model");

module.exports.findUser = (email)=>{
    return new Promise((resolve , reject)=>{
        userModel.findOne({email : email})
                .then((user)=>{
                    if(user){
                        resolve(true)
                    }else{
                        resolve(false)
                    }
                }).catch(err=>{
                    reject(err)
                })
    })
}

module.exports.findUserById = (id)=>{
    return new Promise((resolve,reject)=>{
        User.findById(id)
            .then(result=>{
                resolve(result)
            })
            .catch(err=>{
                reject(err)
            })
    })
}

module.exports.updateUser = (id , data)=>{
    return new Promise(async(resolve , reject)=>{
        const user =await User.findById(id)

        const result = user.validPassword(data.password , user)

        if(result == false){
            resolve('wrong password')
        }else{
            User.findByIdAndUpdate(id , {
                image:data.image,
                name:data.name,
            }).then((user)=>{
                resolve(user)
            }).catch((err)=>{
                reject(err)
            })
        }
    })
}

module.exports.updatePassword = (id , newPassword)=>{
    return new Promise((resolve , reject)=>{
        User.findByIdAndUpdate(id , {
                password:newPassword,
            }).then((user)=>{
                resolve(user)
            }).catch((err)=>{
                reject(err)
            })
    })
}

module.exports.getAllusers = (query , id)=>{
    return new Promise((resolve , reject)=>{
        User.find({'_id': {$ne: id},  isSuperAdmin : false})
            .limit(query.limit)
            .skip(query.skip)
            .sort('-isAdmin joinDate')
            .then((users)=>{
            resolve(users)
        }).catch((err)=>{
            reject(err)
        })
    })
}

module.exports.deleteUser = (id)=>{
    return new Promise((resolve , reject)=>{
        User.findByIdAndDelete(id)
            .then((user)=>{
                resolve(user)
            }).catch((err)=>{
                reject(err)
            })
    })
}

module.exports.changeAdminProperty = (id , value)=>{
        return new Promise((resolve , reject)=>{
        User.findByIdAndUpdate(id , {
            isAdmin : value
        }).then((result)=>{
            resolve(result)
        }).catch((err)=>{
            reject(err)
        })
    })
}