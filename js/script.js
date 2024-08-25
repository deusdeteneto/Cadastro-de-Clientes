$(document).ready(function () {
  // Aplicar máscara ao campo CEP
  $("#inputCep").mask("00000-000");

  function limpa_formulário_cep() {
    // Limpa valores do formulário de cep.
    $("#inputAddress").val("");
    $("#inputDistrict").val("");
    $("#inputCity").val("");
    $("#inputState").val("");
  }

  //Quando o campo cep perde o foco.
  $("#inputCep").blur(function () {
    //Nova variável "cep" somente com dígitos.
    var cep = $(this).val().replace(/\D/g, "");

    //Verifica se campo cep possui valor informado.
    if (cep != "") {
      //Expressão regular para validar o CEP.
      var validacep = /^[0-9]{8}$/;

      //Valida o formato do CEP.
      if (validacep.test(cep)) {
        // Habilitar o campo Número mesmo com o fieldset desativado
        $("#inputNumber").prop("disabled", false);
        //Preenche os campos com "..." enquanto consulta webservice.
        $("#inputAddress").val("...");
        $("#inputDistrict").val("...");
        $("#inputCity").val("...");
        $("#inputState").val("...");

        //Consulta o webservice viacep.com.br/
        $.getJSON(
          "https://viacep.com.br/ws/" + cep + "/json/?callback=?",
          function (dados) {
            if (!("erro" in dados)) {
              //Atualiza os campos com os valores da consulta.
              $("#inputAddress").val(dados.logradouro);
              $("#inputDistrict").val(dados.bairro);
              $("#inputCity").val(dados.localidade);
              $("#inputState").val(dados.uf);
            } //end if.
            else {
              //CEP pesquisado não foi encontrado.
              limpa_formulário_cep();
              alert("CEP não encontrado.");
            }
          }
        );
      } //end if.
      else {
        //cep é inválido.
        limpa_formulário_cep();
        alert("Formato de CEP inválido.");
      }
    } //end if.
    else {
      //cep sem valor, limpa formulário.
      limpa_formulário_cep();
    }
  });
});
