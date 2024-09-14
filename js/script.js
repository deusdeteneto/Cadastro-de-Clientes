$(document).ready(function () {
  // Variável para armazenar o estado de validação do CEP
  let cepValido = false;

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

  // Função para exibir o botão de loading
  function mostrarLoading() {
    $("#loadingButton").removeClass("d-none");
  }

  // Função para ocultar o botão de loading
  function esconderLoading() {
    $("#loadingButton").addClass("d-none");
  }

  // Buscar endereço pelo CEP
  $("#inputCep").on("blur", function () {
    const cep = $(this).val().replace("-", "");

    if (cep.length === 8 && /^[0-9]+$/.test(cep)) {
      mostrarLoading(); // Mostrar o spinner

      $.getJSON(`https://viacep.com.br/ws/${cep}/json/`)
        .done(function (data) {
          if (!data.erro) {
            $("#cep-notFound").text("");
            $("#cep-invalid").text("");
            $("#inputAddress").val(data.logradouro);
            $("#inputDistrict").val(data.bairro);
            $("#inputCity").val(data.localidade);
            $("#inputState").val(data.uf);
            cepValido = true; // CEP é válido
          } else {
            limparFormularioCep();
            $("#cep-notFound").text("CEP pesquisado não foi encontrado.");
            cepValido = false; // CEP não encontrado
          }
        })
        .fail(function () {
          limparFormularioCep();
          $("#cep-invalid").text("Erro ao buscar CEP.");
          cepValido = false; // Erro ao buscar CEP
        })
        .always(function () {
          esconderLoading(); // Ocultar o spinner quando a chamada for concluída
        });
      habilitarNumero();
    } else {
      limparFormularioCep();
      $("#cep-invalid").text("CEP inválido.");
      cepValido = false; // CEP inválido
    }
  });

  // Array para armazenar os clientes
  const clientes = [];

  // Envio do formulário
  $("#clientForm").on("submit", function (event) {
    event.preventDefault();

    // Verificar se o CEP é válido antes de continuar
    if (!cepValido) {
      $("#duplicateModal").modal("show");
      return; // Interrompe o envio do formulário
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
      // Mostrar alerta de cliente já existente
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
