
cl = console.log;

const postform = document.getElementById("postform");
const title = document.getElementById("title");
const content = document.getElementById("content");
const idcontrol = document.getElementById("numbers");
const postcontainer = document.getElementById("postcontainer");

const submitbtn = document.getElementById("submitbtn");
const updatebtn = document.getElementById("updatebtn");


function snackbar(title, icon) {
    swal.fire({
        title,
        icon,
        timer: 2000
    })
}


function togglespinner(flag) {
    if (flag) {
        spinner.classList.remove("d-none")
    } else {
        spinner.classList.add("d-none")
    }
}


function createarr(obj) {
    let arr = [];
    for (const key in obj) {
        arr.unshift({ ...obj[key], id: key })
    }
    return arr;
}



const BASE_URL = "https://posts-task-generic-function-default-rtdb.firebaseio.com";

const POST_URL = "https://posts-task-generic-function-default-rtdb.firebaseio.com/posts.json";


function fetchallposts() {
    fetch(POST_URL, {
        method: "GET",
        body: null,
        headers: {
            AUTH: "Token from Localstorage",
            "content-type": "application/json"
        }
    })
        .then(res => res.json())
        .then(data => {
            cl(data)
            let posts = createarr(data);
            createcards(posts);
        })
        .catch(err => {
            cl(err)
        })
}



fetchallposts();


function createcards(arr) {
    let result = arr.map(obj => {
        return `<div class="col-md-4 mb-3" id=${obj.id}>
                <div class="card">
                    <div class="card-header">
                        <h3>${obj.title}</h3>
                    </div>

                    <div class="card-body">
                        <p>${obj.content}</p>
                    </div>

                    <div class="card-footer d-flex justify-content-between">
                        <button class="btn-outline-primary btn-sm" onclick="onEdit(this)">Edit</button>
                         <button class="btn-outline-danger btn-sm" onclick="onRemove(this)">Remove</button>
                    </div>
                </div>
            </div>`
    })
    postcontainer.innerHTML = result.join("");
}


function onsubmit(eve) {
    eve.preventDefault();

    togglespinner(true);

    let post_obj = {
        title: title.value,
        content: content.value,
        id: idcontrol.value
    }

    fetch(POST_URL, {
        method: "POST",
        body: JSON.stringify(post_obj),
        headers: {
            AUTH: "Token from Localstorage",
            "content-type": "application/json"
        }
    })
        .then(res => res.json())
        .then(data => {
            cl(data)


            let col4 = document.createElement("div");
            col4.className = "col-md-4 mb-3";
            col4.id = data.name;

            col4.innerHTML = `<div class="card">
                    <div class="card-header">
                        <h3>${post_obj.title}</h3>
                    </div>

                    <div class="card-body">
                        <p>${post_obj.content}</p>
                    </div>

                    <div class="card-footer d-flex justify-content-between">
                        <button class="btn-outline-primary btn-sm" onclick="onEdit(this)">Edit</button>
                         <button class="btn-outline-danger btn-sm" onclick="onRemove(this)">Remove</button>
                    </div>
                </div>`;

            postcontainer.prepend(col4);
            postform.reset();
            snackbar(`Post of ID ${data.name} Created Successfully`, "success");
        })
        .catch(err => {
            cl(err)
            snackbar(err, "error");
        })
        .finally(() => {
            togglespinner(false);
        })
}



function onRemove(ele) {

    togglespinner(true);

    Swal.fire({
        title: "Do you want to remove this movie?",
        showCancelButton: true,
        confirmButtonText: "Remove",
    }).then((result) => {
        if (result.isConfirmed) {
            let remove_id = ele.closest(".col-md-4").id;

            const REMOVE_URL = `${BASE_URL}/posts/${remove_id}.json`;

            fetch(REMOVE_URL, {
                method: "DELETE",
                body: null,
                headers: {
                    AUTH: "Token from Localstorage",
                    "content-type": "application/json"
                }
            })
                .then(res => res.json())
                .then(data => {
                    cl(data)
                    snackbar(`Post of ID ${remove_id} Deleted Successfully`, "success");
                    ele.closest(".col-md-4").remove();
                })
                .catch(err => {
                    cl(err)
                    snackbar(err, "error");
                })
                .finally(() => {
                    togglespinner(false);
                })

        }

    })

}


function onEdit(ele) {

    togglespinner(true);

    let EDIT_ID = ele.closest(".col-md-4").id;

    localStorage.setItem("EDIT_ID", EDIT_ID);

    const EDIT_URL = `${BASE_URL}/posts/${EDIT_ID}.json`;

    fetch(EDIT_URL, {
        method: "GET",
        body: null,
        headers: {
            AUTH: "Token from Localstorage",
            "content-type": "application/json"

        }

    })
        .then(res => res.json())
        .then(res => {
            cl(res)
            title.value = res.title;
            content.value = res.content;
            idcontrol.value = res.id;


            submitbtn.classList.add("d-none");
            updatebtn.classList.remove("d-none")

        })
        .catch(err => {
            cl(err)
            snackbar(err, "error");
        })
        .finally(() => {
            togglespinner(false);
        })
}


function onupdate() {

    togglespinner(true);

    let update_id = localStorage.getItem("EDIT_ID");

    const UPDATE_URL = `${BASE_URL}/posts/${update_id}.json`;

    let update_obj = {
        title: title.value,
        content: content.value,
        id: idcontrol.value
    }


    fetch(UPDATE_URL, {
        method: "PATCH",
        body: JSON.stringify(update_obj),
        headers: {
            AUTH: "Token from Localstorage",
            "content-type": "application/json"
        }
    })
        .then(res => res.json())
        .then(res => {
            cl(res)

            let col4 = document.getElementById(update_id);

            col4.querySelector(".card-header h3").innerText = update_obj.title;
            col4.querySelector(".card-body p").innerText = update_obj.content;

            submitbtn.classList.remove("d-none");
            updatebtn.classList.add("d-none");
            postform.reset();

            snackbar(`Post of ID ${update_id} Updated Successfully`, "success");

        })
        .catch(err => {
            cl(err)
            snackbar(err, "error");
        })
        .finally(() => {
            togglespinner(false);
        })
}




postform.addEventListener("submit", onsubmit)
updatebtn.addEventListener("click", onupdate)