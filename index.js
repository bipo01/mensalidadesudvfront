let senha;

document.querySelector(".entrar").addEventListener("click", async () => {
    senha = document.querySelector("#loginInp").value;

    const response = await fetch(
        `https://mensalidadesudvapi.vercel.app/?senha=${senha}`
    );
    const data = await response.json();
    console.log(data);

    if (data === "Correta") {
        document.querySelector(".login").classList.add("d-none");
        document.querySelector(".funcionalidades").classList.remove("d-none");
        optionsSocios();
    } else {
        alert("Senha Incorreta");
        document.querySelector("#loginInp").value = "";
    }
});

//----------FUNÇÕES PARA REQUISITAR API----------//

//Gerar selects com sócios e checar situação (quite ou não)
async function optionsSocios() {
    console.log(senha);
    const response = await fetch(
        `https://mensalidadesudvapi.vercel.app/dados?senha=${senha}`
    );
    const data = await response.json();

    console.log("A data atual é: " + data);

    if (data.length > 0) {
        document.querySelector(".excluirSocio").classList.remove("d-none");
    } else {
        document.querySelector(".excluirSocio").classList.add("d-none");
    }

    document.querySelector("#nomesocio").value = "";

    document.querySelector(
        "#socioInfo"
    ).innerHTML = `<option value="Todos">Todos</option>`;
    document.querySelector(
        "#socioConsulta"
    ).innerHTML = `<option value="Todos">Todos</option>`;
    document.querySelector("#socioEliminar").innerHTML = ``;

    data.forEach(async (dado) => {
        const socio = dado.nomesocio;

        document
            .querySelector("#socioInfo")
            .insertAdjacentHTML(
                "beforeend",
                `<option value="${dado.nomesocio}">${dado.nomesocio}</option>`
            );
        document
            .querySelector("#socioConsulta")
            .insertAdjacentHTML(
                "beforeend",
                `<option value="${dado.nomesocio}">${dado.nomesocio}</option>`
            );
        document
            .querySelector("#socioEliminar")
            .insertAdjacentHTML(
                "beforeend",
                `<option value="${dado.id}">${dado.nomesocio}</option>`
            );

        const mesesPagos = Object.entries(dado);
        const mesesQuites = [];

        const mesAtual = Number(new Date().getMonth()) + 1;
        console.log(mesAtual);

        for (const [key, value] of mesesPagos) {
            if (value === "Pago") {
                mesesQuites.push(key);
            }
        }

        if (mesesQuites.length >= mesAtual) {
            dado.situacao = "Quite";
            const response = await fetch(
                `https://mensalidadesudvapi.vercel.app/situation?situacao=${dado.situacao}&nomesocio=${dado.nomesocio}&senha=${senha}`
            );
            const data = await response.json();
            console.log(data);
        } else {
            dado.situacao = "Não Quite";
            console.log(dado.nomesocio, dado.situacao);
            const response = await fetch(
                `https://mensalidadesudvapi.vercel.app/situation?situacao=${dado.situacao}&nomesocio=${dado.nomesocio}&senha=${senha}`
            );
            const data = await response.json();
            console.log(data);
        }
    });

    document.querySelector(".novoSocio").classList.add("d-none");
    document.querySelector(".infoMensalidade").classList.add("d-none");
    document.querySelector(".mensalidadesTable").classList.add("d-none");
    document.querySelector(".consultarMensalidades").classList.add("d-none");
    document.querySelector(".eliminarSocio").classList.add("d-none");
}

//Consulta mensalidades de acordo com critérios
async function consultarMensalidades() {
    await optionsSocios();
    document.querySelector(".novoSocio").classList.add("d-none");
    document.querySelector(".infoMensalidade").classList.add("d-none");
    document.querySelector(".consultarMensalidades").classList.add("d-none");

    document.querySelector(".tbodyTable").innerHTML = " ";
    const socioConsulta = document.querySelector("#socioConsulta").value;
    const lugarConsulta = document.querySelector("#lugarConsulta").value;
    const situacaoConsulta = document.querySelector("#situacaoConsulta").value;

    console.log(socioConsulta, lugarConsulta, situacaoConsulta);

    const response = await fetch(
        `https://mensalidadesudvapi.vercel.app/filter?nomesocio=${socioConsulta}&situacao=${situacaoConsulta}&grau=${lugarConsulta}&senha=${senha}`
    );
    const data = await response.json();

    if (data.length > 0) {
        document.querySelector(".mensalidadesTable").classList.remove("d-none");

        data.forEach(async (socio) => {
            const html = `
                        <tr class="${
                            socio.situacao === "Quite" ? "pago" : "naopago"
                        }">
                            <td>${socio.nomesocio}</td>
                            <td>${socio.grau}</td>
                            <td id="${socio.id} jan" class="clicavel">${
                socio.jan || " "
            }</td>
                            <td id="${socio.id} fev" class="clicavel">${
                socio.fev || " "
            }</td>
                            <td id="${socio.id} mar" class="clicavel">${
                socio.mar || " "
            }</td>
                            <td id="${socio.id} abr" class="clicavel">${
                socio.abr || " "
            }</td>
                            <td id="${socio.id} mai" class="clicavel">${
                socio.mai || " "
            }</td>
                            <td id="${socio.id} jun" class="clicavel">${
                socio.jun || " "
            }</td>
                            <td id="${socio.id} jul" class="clicavel">${
                socio.jul || " "
            }</td>
                            <td id="${socio.id} ago" class="clicavel">${
                socio.ago || " "
            }</td>
                            <td id="${socio.id} setembro" class="clicavel">${
                socio.setembro || " "
            }</td>
                            <td id="outubro" class="clicavel">${
                                socio.outubro || " "
                            }</td>
                            <td id="${socio.id} nov" class="clicavel">${
                socio.nov || " "
            }</td>
                            <td id="${socio.id} dez" class="clicavel">${
                socio.dez || " "
            }</td>
                            <td>${socio.situacao}</td>
                        </tr>
                        
                   `;

            document
                .querySelector(".tbodyTable")
                .insertAdjacentHTML("afterbegin", html);

            document.querySelectorAll(".clicavel").forEach((td) => {
                td.addEventListener("click", salvarClick);
            });
        });
        console.log(data);
    } else {
        document
            .querySelector(".table-responsive")
            .insertAdjacentHTML(
                "afterbegin",
                "<p class='dadosSemCri'>Não há dados que atendam esses critérios...</p>"
            );
    }
}

//Adiciona novo sócio
async function novoSocio() {
    let nomesocio = document.querySelector("#nomesocio").value;
    let lugar = document.querySelector("#lugar").value;

    const response = await fetch(
        `https://mensalidadesudvapi.vercel.app/novo?nomesocio=${nomesocio}&lugar=${lugar}&senha=${senha}`
    );

    const data = await response.json();

    console.log(data);
    await optionsSocios();
}

//Adiciona ou remove meses pagos
async function salvarInfo() {
    const nomesocio = document.querySelector("#socioInfo").value;
    const mes = document.querySelector("#mesesinfo").value;
    const condicao = document.querySelector("#pagamento").value;

    console.log(nomesocio);
    console.log(mes);
    console.log(condicao);

    const response = await fetch(
        `https://mensalidadesudvapi.vercel.app/salvar?nomesocio=${nomesocio}&mes=${mes}&condicao=${condicao}&senha=${senha}`
    );

    const data = await response.json();

    console.log(data);
}

//Exclui sócios
async function excluir() {
    const socioEliminadoId = document.querySelector("#socioEliminar").value;
    console.log(socioEliminadoId);

    const response = await fetch(
        `https://mensalidadesudvapi.vercel.app/excluir?id=${socioEliminadoId}&senha=${senha}`
    );

    const data = await response.json();
    console.log(data);

    await optionsSocios();
}
//Adiciona condição de "pago" ao clicar no mês em questão
async function salvarClick() {
    const ids = this.id.split(" ");
    const mes = ids[1];
    const id = ids[0];

    const condicao = this.textContent === "Pago" ? "" : "Pago";
    this.textContent = condicao;
    console.log(condicao);

    const response = await fetch(
        `https://mensalidadesudvapi.vercel.app/alternar?id=${id}&condicao=${condicao}&mes=${mes}&senha=${senha}`
    );

    const data = await response.json();
    console.log(data);
}

//----------Botões com as funções-----------//
document
    .querySelector(".consultarMensalidadesBtn")
    .addEventListener("click", consultarMensalidades);

document.querySelector(".socioEliminarBtn").addEventListener("click", excluir);

document
    .querySelector(".infoMensalidadesBtn")
    .addEventListener("click", salvarInfo);

document.querySelector(".novoSocioBtn").addEventListener("click", novoSocio);

//-----------Botões para esconder ou mostrar um elemento----------//
document.querySelector(".addNovoSocio").addEventListener("click", () => {
    document.querySelector(".novoSocio").classList.toggle("d-none");
    document.querySelector(".infoMensalidade").classList.add("d-none");
    document.querySelector(".mensalidadesTable").classList.add("d-none");
    document.querySelector(".consultarMensalidades").classList.add("d-none");
    document.querySelector(".eliminarSocio").classList.add("d-none");
    if (document.querySelector(".dadosSemCri")) {
        document.querySelector(".dadosSemCri").textContent = "";
    }
});

document.querySelector(".excluirSocio").addEventListener("click", () => {
    document.querySelector(".eliminarSocio").classList.toggle("d-none");
    document.querySelector(".novoSocio").classList.add("d-none");
    document.querySelector(".infoMensalidade").classList.add("d-none");
    document.querySelector(".mensalidadesTable").classList.add("d-none");
    document.querySelector(".consultarMensalidades").classList.add("d-none");
    if (document.querySelector(".dadosSemCri")) {
        document.querySelector(".dadosSemCri").textContent = "";
    }
});

document.querySelector(".salvarSocio").addEventListener("click", () => {
    document.querySelector(".novoSocio").classList.add("d-none");
    document.querySelector(".infoMensalidade").classList.toggle("d-none");
    document.querySelector(".mensalidadesTable").classList.add("d-none");
    document.querySelector(".consultarMensalidades").classList.add("d-none");
    document.querySelector(".eliminarSocio").classList.add("d-none");
    if (document.querySelector(".dadosSemCri")) {
        document.querySelector(".dadosSemCri").textContent = "";
    }
});

document.querySelector(".consultarTabela").addEventListener("click", () => {
    document.querySelector(".novoSocio").classList.add("d-none");
    document.querySelector(".infoMensalidade").classList.add("d-none");
    document.querySelector(".mensalidadesTable").classList.add("d-none");
    document.querySelector(".consultarMensalidades").classList.toggle("d-none");
    document.querySelector(".eliminarSocio").classList.add("d-none");
    if (document.querySelector(".dadosSemCri")) {
        document.querySelector(".dadosSemCri").textContent = "";
    }
});
