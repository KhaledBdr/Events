function deleteEvent(){
    let btn = document.getElementById('deleteBTN')
    let deletedId = btn.getAttribute('data-set')
    console.log(deletedId);

    axios.delete(`/events/event/delete/${deletedId}`)
    alert('Record deleted')
    window.location.href = '/events/1'
}

function EnDisBTN(){

  let agreeBTN = document.getElementById('agree-term')
  let signupBTN = document.getElementById('signup')
  if(agreeBTN.checked){
      console.log("Hi");
    signupBTN.disabled = false
  }else{
    signupBTN.disabled = true
  }
}
