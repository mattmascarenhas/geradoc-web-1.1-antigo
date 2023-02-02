export function mascaraCep(event) {
  event.currentTarget.maxLength = 9;
  let value = event.currentTarget.value;
  value = value.replace(/^(\d{5})(\d)/, "$1-$2");
  event.currentTarget.value = value;
  //essa parte comentada é outra forma de desabilitar Caracter
  //value = value.replace(/\D/g, '')
  return event;
}

export function mascaraTelefone(event) {
  event.currentTarget.maxLength = 14;
  let value = event.currentTarget.value;
  value = value.replace(
    /^(\d{0})(\d{1})(\d{1})(\d{2})(\d{3})(\d{4})/,
    "$1($2$3)$4$5-$6"
  );
  event.currentTarget.value = value;
  return event;
}

// export function disabledRG(l) {
//   var orgaoEmissor = document.querySelector('#orgaoEmissor')
//   var rg = document.querySelector('#rg')
//   if (l >= 18) {
//     rg.disabled = true
//     orgaoEmissor.disabled = true
//   }
//   if (l < 18) {
//     rg.disabled = false
//     orgaoEmissor.disabled = false
//   }
// }
