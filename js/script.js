$(document).ready(function () {
  // Aplicar máscara ao campo CEP
  $("#inputCep").mask("00000-000");

  // Função para limpar os campos do formulário
  function limparFormularioCep() {
    $("#inputAddress").val("");
    $("#inputNumber").val("");
    $("#inputDistrict").val("");
    $("#inputCity").val("");
    $("#inputState").val("");
  }

  // Função para habilitar o campo Número
  function habilitarNumero() {
    $("#inputNumber").prop("disabled", false);
    $("#inputAddress").val("...");
    $("#inputDistrict").val("...");
    $("#inputCity").val("...");
    $("#inputState").val("...");
  }

  // Buscar endereço pelo CEP
  let cepValido = false;

  $("#inputCep").on("blur", function () {
    const cep = $(this).val().replace("-", "");

    if (cep.length === 8 && /^[0-9]+$/.test(cep)) {
      $.getJSON(`https://viacep.com.br/ws/${cep}/json/`)
        .done(function (data) {
          if (!data.erro) {
            limparFormularioCep();
            $("#inputAddress").val(data.logradouro);
            $("#inputDistrict").val(data.bairro);
            $("#inputCity").val(data.localidade);
            $("#inputState").val(data.uf);
            cepValido = true; // CEP válido
          } else {
            limparFormularioCep();
            $("#cepErrorModal").modal("show");
            cepValido = false; // CEP inválido
          }
        })
        .fail(function () {
          limparFormularioCep();
          $("#cepErrorModal").modal("show");
          cepValido = false; // CEP inválido
        });
      habilitarNumero();
    } else {
      limparFormularioCep();
      $("#cepErrorModal").modal("show");
      cepValido = false; // CEP inválido
    }
  });

  // Array para armazenar os clientes
  const clientes = [];

  // Envio do formulário
  $("#clientForm").on("submit", function (event) {
    event.preventDefault();

    if (!cepValido) {
      $("#cepErrorModal").modal("show");
      return; // Não prosseguir com o salvamento
    }

    // Dados do formulário
    const nome = $("#inputName").val();
    const sobrenome = $("#inputSurname").val();
    const endereco = $("#inputAddress").val();
    const numero = $("#inputNumber").val();
    const bairro = $("#inputDistrict").val();
    const cidade = $("#inputCity").val();
    const estado = $("#inputState").val();
    const cep = $("#inputCep").val();

    // Verificar se o cliente já existe
    const clienteExistente = clientes.find(
      (cliente) =>
        cliente.nome === nome &&
        cliente.sobrenome === sobrenome &&
        cliente.endereco === endereco &&
        cliente.numero === numero &&
        cliente.bairro === bairro &&
        cliente.cidade === cidade &&
        cliente.estado === estado &&
        cliente.cep === cep
    );

    if (clienteExistente) {
      // Mostrar a modal de cliente já existente
      $("#duplicateModal").modal("show");
    } else {
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
      limparFormularioCep();
      cepValido = false; // Resetar a variável após salvar
    }
  });

  // Atualiza a tabela com os clientes
  function atualizarTabela() {
    const tbody = $("table tbody");
    tbody.empty(); // Limpa a tabela atual/existente

    clientes.forEach((cliente, index) => {
      tbody.append(`
        <tr>
          <th scope="row" class="d-none d-md-table-cell">${index + 1}</th>
          <td>${cliente.nome} ${cliente.sobrenome}</td>
          <td>${cliente.endereco}, ${cliente.numero}</td>
          <td>${cliente.cep}</td>
          <td class="d-none d-md-table-cell">${cliente.bairro}</td>
          <td class="d-none d-md-table-cell">${cliente.cidade}</td>
          <td class="d-none d-md-table-cell">${cliente.estado}</td>
        </tr>
      `);
    });
  }
});
