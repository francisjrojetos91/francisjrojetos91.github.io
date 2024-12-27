var form = document.getElementById("myForm"),
    imgInput = document.querySelector(".img"),
    file = document.getElementById("imgInput"),
    codigo = document.getElementById("codigo"),
    corredor = document.getElementById("corredor"),
    prateleira = document.getElementById("prateleira"),
    submitBtn = document.querySelector(".submit"),
    userInfo = document.getElementById("data"),
    modalTitle = document.querySelector("#userForm .modal-title"),
    newUserBtn = document.querySelector(".newUser"),
    searchInput = document.getElementById("searchInput");

let getData = localStorage.getItem('userProfile') ? JSON.parse(localStorage.getItem('userProfile')) : [];
let isEdit = false, editId;

showInfo();

newUserBtn.addEventListener('click', () => {
    submitBtn.innerText = 'Submit';
    modalTitle.innerText = "Fill the Form";
    isEdit = false;
    imgInput.src = "./image/Profile Icon.webp";
    form.reset();
});

file.onchange = function () {
    if (file.files[0].size < 1000000) { // 1MB = 1000000
        var fileReader = new FileReader();

        fileReader.onload = function (e) {
            imgInput.src = e.target.result;
        }

        fileReader.readAsDataURL(file.files[0]);
    } else {
        alert("This file is too large!");
    }
}

function showInfo() {
    document.querySelectorAll('.employeeDetails').forEach(info => info.remove());
    getData.forEach((element, index) => {
        let createElement = `<tr class="employeeDetails">
            <td>${index + 1}</td>
            <td><img src="${element.picture}" alt="" width="50" height="50"></td>
            <td>${element.codigo}</td>
            <td>${element.corredor}</td>
            <td>${element.prateleira}</td>
            <td>
                <button class="btn btn-success" onclick="readInfo('${element.picture}', '${element.codigo}', '${element.corredor}', '${element.prateleira}')" data-bs-toggle="modal" data-bs-target="#readData"><i class="bi bi-eye"></i></button>
                <button class="btn btn-primary" onclick="editInfo(${index}, '${element.picture}', '${element.codigo}', '${element.corredor}', '${element.prateleira}')" data-bs-toggle="modal" data-bs-target="#userForm"><i class="bi bi-pencil-square"></i></button>
                <button class="btn btn-danger" onclick="deleteInfo(${index})"><i class="bi bi-trash"></i></button>
            </td>
        </tr>`;

        userInfo.innerHTML += createElement;
    });
}
showInfo();

function readInfo(pic, codigo, corredor, prateleira) {
    document.querySelector('.showImg').src = pic;
    document.querySelector('#showCodigo').value = codigo;
    document.querySelector("#showCorredor").value = corredor;
    document.querySelector("#showPrateleira").value = prateleira;
}

function editInfo(index, pic, codigo, corredor, prateleira) {
    isEdit = true;
    editId = index;
    imgInput.src = pic;
    codigo.value = codigo;
    corredor.value = corredor;
    prateleira.value = prateleira;

    submitBtn.innerText = "Update";
    modalTitle.innerText = "Update The Form";
}

function deleteInfo(index) {
    if (confirm("Are you sure want to delete?")) {
        getData.splice(index, 1);
        localStorage.setItem("userProfile", JSON.stringify(getData));
        showInfo();
    }
}

form.addEventListener('submit', (e) => {
    e.preventDefault();

    const information = {
        picture: imgInput.src == undefined ? "./image/Profile Icon.webp" : imgInput.src,
        codigo: codigo.value,
        corredor: corredor.value,
        prateleira: prateleira.value
    };

    if (!isEdit) {
        getData.push(information);
    } else {
        isEdit = false;
        getData[editId] = information;
    }

    localStorage.setItem('userProfile', JSON.stringify(getData));

    submitBtn.innerText = "Submit";
    modalTitle.innerHTML = "Fill The Form";

    showInfo();

    form.reset();
    imgInput.src = "./image/Profile Icon.webp";  
});

// Função de pesquisa
searchInput.addEventListener("input", function() {
    const searchValue = searchInput.value.toLowerCase();
    const rows = document.querySelectorAll(".employeeDetails");

    rows.forEach(row => {
        const codigoCell = row.cells[2].textContent.toLowerCase(); // A coluna "Código" é a terceira
        if (codigoCell.includes(searchValue)) {
            row.style.display = ""; // Mostra a linha se o código corresponder
        } else {
            row.style.display = "none"; // Esconde a linha se não corresponder
        }
    });
});
