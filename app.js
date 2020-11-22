const addBtn = document.querySelector("#submit");
const addTitle = document.querySelector("#add_text");
const addAmount = document.querySelector("#add_amount");
const incomeList = document.querySelector("#income .list");
const expenseList = document.querySelector("#expense .list");
const balanceTotalEl = document.querySelector("#total_result");
const incomeTotalEl = document.querySelector("#income_total");
const expenseTotalEl = document.querySelector("#expense_total");




// Json stringify på arrayen för att kunna spara data

let ENTRY_LIST;
let balance = 0, income = 0, outcome = 0;

//delete och edit knapp för varje item

const DELETE = "delete", EDIT = "edit";

//kollar om det finns data sparad lokalt

ENTRY_LIST = JSON.parse(localStorage.getItem("entry_list")) || [];
updateUI();

// eventlistner för income och expense list

incomeList.addEventListener("click" , deleteOrEdit);
expenseList.addEventListener("click" , deleteOrEdit);
addBtn.addEventListener("click", budget);

//Functions

function budget(){
    const selector = document.getElementById("add_select").value;
    if(selector == "+"){
        let income = {
        type: "income",
        title: addTitle.value,
        amount: parseInt(addAmount.value)
        }

        ENTRY_LIST.push(income);

        updateUI();
        clearInput( [addTitle, addAmount] ); 
    }

    else if(selector == "-") {
        let expense = {
            type: "expense",
            title: addTitle.value,
            amount: parseInt(addAmount.value)
            }
    
    
            ENTRY_LIST.push(expense);

            updateUI();
            clearInput( [addTitle, addAmount] ); 

    }


}


function deleteOrEdit(event){
    const targetBtn = event.target;

    const entry = targetBtn.parentNode;

    if (targetBtn.id == DELETE){
        deleteEntry(entry);
    }else if (targetBtn.id == EDIT ){
        editEntry(entry);
    }
    
}

function deleteEntry(entry){
    ENTRY_LIST.splice( entry.id, 1);
    updateUI();
}

function editEntry(entry){
    let ENTRY = ENTRY_LIST[entry.id];

    if(ENTRY.type == "income"){
        addAmount.value = ENTRY.amount;
        addTitle.value = ENTRY.title;
    }else if (ENTRY.type == "expense"){
        addAmount.value = ENTRY.amount;
        addTitle.value = ENTRY.title;
    }

    deleteEntry(entry);
    console.log(ENTRY.amount);
}


function updateUI(){
    income = calculateTotal("income", ENTRY_LIST);
    outcome = calculateTotal("expense", ENTRY_LIST);
    balance = calculateBalance(income, outcome);

    // för att få minus framför negativa tal

    let sign = (outcome >= income) ? "-" : "";

    
    // För att uppdatera UI
    balanceTotalEl.innerHTML = `<small>${sign}</small>${balance}`;
    expenseTotalEl.innerHTML = `${outcome}`;
    incomeTotalEl.innerHTML = `${income}`;





    clearElement( [expenseList, incomeList] );



    // för att visa rätt object i rätt lista

    ENTRY_LIST.forEach( (entry, index) => {
        if (entry.type == "expense"){
            showEntry(expenseList, entry.type, entry.title, entry.amount, index)
        }else if (entry.type == "income") {
            showEntry(incomeList, entry.type, entry.title, entry.amount, index)
        }
    });

    //För att kunna spara data lokalt, konverterar data till en json string
    localStorage.setItem("entry_list", JSON.stringify(ENTRY_LIST));
}

function showEntry(list, type, title, amount, id) {

    const entry =  ` <li id = "${id}" class="${type}">
                     <div class="entry">${title}: ${amount}</div>
                     <div id="edit">Edit</div>
                     <div id="delete">Delete</div>


                    </li> `;

    //för att få nytt element att hamna överst
    const position = "afterbegin";

    list.insertAdjacentHTML(position, entry);
}

function clearElement(elements){
    elements.forEach( element => {
        element.innerHTML = "";


    })
}

function calculateTotal (type, list){
    let sum = 0;

    list.forEach( entry => {
        if (entry.type == type){
            sum += entry.amount;
        }
    })
    return sum;
}

function calculateBalance(income, outcome) {
    return income - outcome;
}

function clearInput(inputs) {
    inputs.forEach( input => {
        input.value = "";
    })
}


addBtn.addEventListener("click", budget);