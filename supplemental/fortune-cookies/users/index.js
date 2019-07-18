const uuidv4 = require('uuid/v4');
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
/*
user = {
  id: uuid
  firstName: string,
  lastName: string,
  email: string
  period:string
}
*/

const objectToFile = async (filespec, data) =>{
    const writeFile = promisify(fs.writeFile);
    return await writeFile(filespec, JSON.stringify(data),"utf8");
};

const dataFileName = 'users.json';

const addUser = async (user)=>{
    if(!user.firstName) throw new Error('No first name, please provide one.');
    if(!user.lastName) throw new Error('No last name, please provide one.');
    if(!user.email) throw new Error('No email, please provide one.');
    const period = user.period || '* * * * * *';
    user.id = uuidv4();
    //add the user to data store
    await updateUsers(user);

    return user;
};

const updateUsers =  async (user) =>{
    const arr = getUsersSync();
    arr.push(user);
    const filespec = path.join(__dirname, dataFileName);
    await objectToFile(filespec,arr);
    return arr;
};


const getUsersSync = () =>{
    let arr = [];
    const filespec = path.join(__dirname, dataFileName);
    if(fs.existsSync(filespec)){
        arr  = JSON.parse(fs.readFileSync(filespec, 'utf-8'));
    }
    return arr;
};

const getUsers = async () =>{
    const readFileAsync = promisify(fs.readFile);

    const filespec = path.join(__dirname, dataFileName);
    const reslt = await readFileAsync(filespec, 'utf-8');
    return JSON.parse(reslt);
};
module.exports = {getUsersSync, addUser, getUsers};