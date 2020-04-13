(async() => {
	while(!window.hasOwnProperty("bta")) // define the condition as you like
        await new Promise(resolve => setTimeout(resolve, 1000));
		getProductBookings()
})();

let reservations;
let blackouts = [];
let court1 = {
  title: 'Court 1',
  bookings: []};
let court2 = {
  title: 'Court 2',
  bookings: []};
let court3 = {
  title: 'Court 3',
  bookings: []};

function getProductBookings(){
	const firstDate = new Date()
	let lastDate = new Date()
    const daysToShowInTheFuture = 10;
	lastDate.setDate(lastDate.getDate()+daysToShowInTheFuture);
  	const productIds = [4354962456672,4482396389472,4482398355552]
  
  	const apiEndpoint = `https://cochiseclub.bookthatapp.com/availability?format=json&start=` + formatApiDate(firstDate) + `&end=` + formatApiDate(lastDate) + `&products=` + productIds.toString()
    
    
    jQ.getJSON(apiEndpoint, function (data) {gatherBookingsAndReservations(data)})
};

function formatApiDate(date){
  return date.getFullYear() + "-" + (date.getMonth() + 1) + '-' + date.getDate()
};

function gatherBookingsAndReservations(data) {
  reservations = data
  destructBlackouts(reservations.blackouts)
  destructProducts(reservations.products)
  courts = [court1, court2, court3]
  courts.forEach(court => sortCourt(court))
  const showReservationsElement = document.querySelector('.add-reservations');
  if (showReservationsElement === null) {
  	return null
  }
  const showProductReservationsElement = document.querySelector('.single-product-reservation');
//   reservations.products.forEach(product => addProductReservationsToPage(product, showReservationsElement, showProductReservationsElement))
  courts.forEach(court => addCourtToPage(court, showReservationsElement, showProductReservationsElement))
  showProductReservationsElement.remove();
  showReservationsElement.classList.remove("hidden");
};

function addNoBookingToPage(productElement){
  const bookingElement = document.createElement('p')
  bookingElement.innerText = 'No current reservations';
  productElement.appendChild(bookingElement);
};

function createBookingDate(dateArray){
  let theDate = new Date();
  theDate.setFullYear(dateArray[0]);
  theDate.setMonth(dateArray[1] - 1);
  theDate.setDate(dateArray[2]);
  theDate.setHours(dateArray[3]);
  theDate.setMinutes(dateArray[4]);
  theDate.setSeconds(dateArray[5]);
  return theDate
}

function dateToString(date, start = false){
  //bta includes moment.js library - use that for formatting
  let stringDate = moment(date).format('LT')
  if(start === true){
  	stringDate = moment(date).format('ll') + ': ' + stringDate
  }
  return  stringDate
}


function addCourtBookingToPage(booking, productElement){
  const bookingElement = document.createElement('p')
  const startDate = createBookingDate(booking.start);
  const endDate = createBookingDate(booking.end);
  let bookingStringToDisplay = dateToString(startDate, true) + '-' + dateToString(endDate);
  if(booking.productCategory === 'Admin'){
    bookingStringToDisplay += '*'
  }
  bookingElement.innerText = bookingStringToDisplay;
  productElement.appendChild(bookingElement);
};

function addCourtToPage(court, productsElement, productElement){
  newProductElement = productElement.cloneNode(true)
  productsElement.appendChild(newProductElement)
  const productTitleElement = newProductElement.querySelector('.single-product-title');
  
  productTitleElement.innerText = court.title;
  if(court.bookings.length === 0){    
  	addNoBookingToPage(newProductElement)
  }
  court.bookings.forEach(booking => addCourtBookingToPage(booking, newProductElement));  
};

function destructProducts(products){
  products.forEach(product => destructProduct(product))
}
function destructProduct(product){
  product.bookings.forEach(booking => structuredReservation('Member', product.id, product.title, booking.start, booking.end))
}

function destructBlackouts(blackouts){
	blackouts.forEach(blackout => destructBlackout(blackout))
}

function destructBlackout(blackout){
	blackout.products.forEach(product => structuredReservation('Admin', product.externalProductId, product.title, blackout.start, blackout.end))
}

function structuredReservation(category, productId, productTitle, start, end){
  const newObject = {
    productCategory: category,
    productId: productId,
    productTitle: productTitle,
    start: start,
    end: end,
    startString: start.join('')
  }
  blackouts.push(newObject)
  pushReservationToCourt(newObject)
}

function pushReservationToCourt(product){
  console.log(product);
  if(product.productId === 4482398355552 ){
    court3.bookings.push(product)
    return
  }
  if(product.productId === 4482396389472  ){
    court2.bookings.push(product)
    return
  }
  if(product.productId === 4354962456672  ){
    court1.bookings.push(product)
    return
  }
}

function sortCourt(court){
  court.bookings.sort((a, b) => a.startString.localeCompare(b.startString));
}
