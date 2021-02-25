const LoginBtn = document.querySelector('#login');
const GetUsersBtn = document.querySelector('#getUsers');
const GetWeatherBtn = document.querySelector('#getWeather');


const AddCategoryBtn = document.querySelector('#addCategory');
const GetCategoryBtn = document.querySelector('#getCategory');
const DeleteCategoryBtn = document.querySelector('#deleteCategory');
var token;

LoginBtn.addEventListener('click', () => {
    axios.post('/manager/login', { username: 'admin', password: 'admin' })
        .then(({ data }) => {
            console.log(data);
            token = data.meta.token;
        })
});

GetUsersBtn.addEventListener('click', () => {
    axios.get('/manager/getUsers', { headers: { Authorization: token } }).then(({ data }) => {
        console.log(data);
    }).catch(err => console.log(err));
});

GetWeatherBtn.addEventListener('click', () => {
    axios.get('/manager/weather', { headers: { Authorization: token } }).then(({ data }) => {
        console.log(data);
    }).catch(err => console.log(err));
})

AddCategoryBtn.addEventListener('click', () => {
    axios.post('/manager/category/add', {
        categoryName:
            `${Math.floor(Math.random() * 25 + 10)}Test${Math.floor(Math.random() * 25 + 10)}`
    }, { headers: { Authorization: token } }).then(res => {
        console.log(res.data);
    })
})

GetCategoryBtn.addEventListener('click', () => {
    axios.get('/manager/category/list', { params: { parentId: "0" }, headers: { Authorization: token } }).then(res => {
        console.log(res.data);
    })
})

DeleteCategoryBtn.addEventListener('click', () => {
    axios.delete('/manager/category/delete', { headers: { Authorization: token } }).then(res => {
        console.log(res.data);
    })
})