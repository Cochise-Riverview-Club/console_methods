
(async() => {
	while(!window.hasOwnProperty("bta")) // define the condition as you like
        await new Promise(resolve => setTimeout(resolve, 1000));
		getProductBookings()
})();

let reservations;

function getProductBookings(){
	const firstDate = new Date()
	let lastDate = new Date()
	lastDate.setMonth(lastDate.getMonth()+6);
  	const productIds = [4354962456672,4482396389472,4482398355552]
  
  	const apiEndpoint = `https://cochiseclub.bookthatapp.com/availability?format=json&start=` + formatApiDate(firstDate) + `&end=` + formatApiDate(lastDate) + `&products=` + productIds.toString()
    
    
    jQ.getJSON(apiEndpoint, function (data) {gatherBookingsAndReservations(data)})
};

function formatApiDate(date){
  return date.getFullYear() + "-" + (date.getMonth() + 1) + '-' + date.getDate()
};

function gatherBookingsAndReservations(data) {
  reservations = data
  const showReservationsElement = document.querySelector('.add-reservations');
  console.log(showReservationsElement);
  if (showReservationsElement === null) {
  	return null
  }
  const showProductReservationsElement = document.querySelector('.single-product-reservation');
  console.log(showProductReservationsElement)
  reservations.products.forEach(product => addProductReservationsToPage(product, showReservationsElement, showProductReservationsElement))
  showProductReservationsElement.remove();
  showReservationsElement.classList.remove("hidden");
};

function addProductReservationsToPage(product, productsElement, productElement){
  console.log(productElement);
  const productElements = document.querySelectorAll('.single-product-reservation')
  newProductElement = productElement.cloneNode(true)
  productsElement.appendChild(newProductElement)
  const productTitleElement = newProductElement.querySelector('.single-product-title');
  
  productTitleElement.innerText = product.title;
  product.bookings.forEach(booking => addBookingToPage(booking, productElement));
};

function addBookingToPage(booking, productElement){
  const bookingElement = document.createElement('p')
  const startDate = createBookingDate(booking.start);
  const endDate = createBookingDate(booking.end);
//   let startDateString = booking.start.join();
//   console.log(startDateString);
//   startDateString = '2020,4,5,10,30'
//   console.log(startDateString);
//   const startDate = new Date(startDateString);
  console.log(startDate);
  bookingElement.innerText = dateToString(startDate, true) + '-' + dateToString(endDate);
  productElement.appendChild(bookingElement);
};

function createBookingDate(dateArray){
  console.log(dateArray)
  let theDate = new Date();
  theDate.setFullYear(dateArray[0]);
  theDate.setMonth(dateArray[1] - 1);
  theDate.setDate(dateArray[2]);
  theDate.setHours(dateArray[3]);
  theDate.setMinutes(dateArray[4]);
  theDate.setSeconds(dateArray[5]);
  console.log('hhhhhhh' + theDate)
  return theDate
}

function dateToString(date, start = false){
  stringDate = appendLeadingZeroes(date.getHours()) + ':' + appendLeadingZeroes(date.getMinutes())
  if(start === true){
  	stringDate = (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear() + ': ' + stringDate
  }
  return  stringDate
}

function appendLeadingZeroes(n){
  if(n <= 9){
    return "0" + n;
  }
  return n
}
