import "./index.css";

const URL = "http://localhost:3030/doctors"
const SEARCH_DIV = document.getElementById("searchContainer")

var doctors


fetchData(URL)


//TABLE
const TABLE = document.getElementById("doctors")

//SELECT FILTER
var filter_is_on = false
document.getElementById("availabilityFilterSelect").addEventListener("change", () => {
    filter_is_on = !filter_is_on
    filterDoctors()
})

//SEARCH CONTAINER
SEARCH_DIV.innerHTML = '<input type="text" id="searchDoctor" placeholder="Search by Name">'

var searchInput = document.getElementById("searchDoctor")
searchInput.addEventListener("input", () => {
    searchDoctors(searchInput.value)
})

//FUNCTIONS
function fetchData(URL) {
    fetch(URL)
        .then(res => res.json())
        .then(data => doctors = data)
        .then(() => {
            renderTableItems()
        })
        .then(() => {
            addListenersOnDoctors()
        })
}

function renderTableItems() {
    for (let doctor in doctors) {

        let doctor_status = doctors[doctor].available ? "Available" : "Unavailable"
        let button_status = doctor.available ? "Mark as Unavailable" : "Mark as Available"

        TABLE.innerHTML +=
            `<tr data-upin="${doctors[doctor].id}">
            <td>${doctors[doctor].name}</td>
            <td>${doctors[doctor].zip}</td>
            <td>${doctors[doctor].city}</td>
            <td>${doctor_status}</td>
            <td><button class="button button-outline">${button_status}</button></td>
            </tr>`

        updateDiv(doctors[doctor])

    }
}

function addListenersOnDoctors(){
    for(let doctor in doctors){
        let line = document.querySelector(`[data-upin="${doctors[doctor].id}"]`)

        line.getElementsByTagName("button")[0]
            .addEventListener("click", () => {
                changeStatus(line, doctors[doctor])
            })
    }
}

function changeStatus(line, doctor) {

    var query = `${URL}/${doctor.id}`
    let new_status = !doctor.available

    doctors = doctors.map(element => {
        if (element.id == doctor.id) {
            element.available = new_status
        }
        return element
    })

    updateDiv(doctor)

    fetch(query, {
        method: 'PATCH',
        body: JSON.stringify({
            available: new_status
        }),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    })
}

function updateDiv(doctor) {

    let div = document.querySelector(`[data-upin="${doctor.id}"]`)
    let doctor_status = doctor.available ? "Available" : "Unavailable"
    let button_status = doctor.available ? "Mark as Unavailable" : "Mark as Available"

    if (doctor.available) {
        div.className = "available"
    } 
    
    else {
        
        div.className = "unavailable"

        if(filter_is_on){
            div.style.display = "none"
        }
    }

    // Updates the doctor status on table
    div.getElementsByTagName("td")[3].innerHTML = doctor_status
    div.getElementsByClassName("button")[0].innerHTML = button_status

}

function filterDoctors() {

    let divs = document.getElementsByClassName("unavailable")

    if (filter_is_on) {

        divs = Array.prototype.slice.call(divs)

        divs.forEach(element => element.style.display = "none")
        
    } else {
        if(!searchInput.value){

            divs = Array.prototype.slice.call(divs)

            divs.forEach(element => element.style.display = "revert")
            
        }
    } 
}

function searchDoctors(input) {
    var filter = input.toUpperCase();
    var trs = TABLE.getElementsByTagName("tr")
    var td, txtValue

    for (let i = 0; i < trs.length; i++) {
        td = trs[i].getElementsByTagName("td")[0];
        if (td) {
          txtValue = td.textContent || td.innerText;
          if (txtValue.toUpperCase().indexOf(filter) > -1) {

            if(filter_is_on){
                if(trs[i].getElementsByTagName("td")[3].innerHTML == "Available"){
                    trs[i].style.display = "";
                }
            }
            else{
               trs[i].style.display = "";
            }

          } else {
            trs[i].style.display = "none";
          }
        }
    }

    if(input == ""){
        filterDoctors()
    }
}