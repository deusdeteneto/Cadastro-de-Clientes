const cepNotFound = document.querySelector("#cep-notFound");
const cepInvalid = document.querySelector("#cep-invalid");
const clientes = [];

$(document).ready(function () {
  // Aplicar máscara ao campo CEP
  $("#inputCep").mask("00000-000");

  function limpa_formulário_cep() {
    $("#inputAddress").val("");
    $("#inputDistrict").val("");
    $("#inputCity").val("");
    $("#inputState").val("");
  }

  $("#inputCep").blur(function () {
    const cep = $(this).val().replace(/\D/g, "");

    if (cep) {
      const validacep = /^[0-9]{8}$/;

      if (validacep.test(cep)) {
        $("#inputNumber").prop("disabled", false);
        $("#inputAddress").val("...");
        $("#inputDistrict").val("...");
        $("#inputCity").val("...");
        $("#inputState").val("...");

        $.getJSON(
          `https://viacep.com.br/ws/${cep}/json/?callback=?`,
          function (dados) {
            if (!("erro" in dados)) {
              cepNotFound.innerText = ``;
              cepInvalid.innerText = ``;
              $("#inputAddress").val(dados.logradouro);
              $("#inputDistrict").val(dados.bairro);
              $("#inputCity").val(dados.localidade);
              $("#inputState").val(dados.uf);
            } else {
              limpa_formulário_cep();
              cepNotFound.innerText = `CEP pesquisado não foi encontrado.`;
            }
          }
        );
      } else {
        limpa_formulário_cep();
        cepInvalid.innerText = `CEP é inválido.`;
      }
    } else {
      limpa_formulário_cep();
    }
  });
});

$("#clientForm").submit(function (event) {
  event.preventDefault();

  //Dados do formulário
  const nome = document.querySelector("#inputName").value;
  const sobrenome = document.querySelector("#inputSurname").value;
  const endereco = document.querySelector("#inputAddress").value;
  const numero = document.querySelector("#inputNumber").value;
  const bairro = document.querySelector("#inputDistrict").value;
  const cidade = document.querySelector("#inputCity").value;
  const estado = document.querySelector("#inputState").value;
  const cep = document.querySelector("#inputCep").value;

  // Adiciona o novo cliente ao array
  clientes.push({
    nome,
    sobrenome,
    endereco,
    numero,
    bairro,
    cidade,
    estado,
    cep,
  });

  // Atualiza a tabela
  atualizarTabela();

  // Limpa o formulário
  $("#clientForm")[0].reset();
  limpa_formulário_cep();
});

function atualizarTabela() {
  const tbody = $("table tbody");
  tbody.empty(); //Limpa a tabela atual/existente

  clientes.forEach((cliente, index) => {
    tbody.append(`
      <tr>
            <th scope="row">${index + 1}</th>
            <td>${cliente.nome} ${cliente.sobrenome}</td>
            <td>${cliente.endereco}, ${cliente.numero}</td>
            <td>${cliente.cep}</td>
            <td>${cliente.bairro}</td>
            <td>${cliente.cidade}</td>
            <td>${cliente.estado}</td>
          </tr>
      `);
  });
}
