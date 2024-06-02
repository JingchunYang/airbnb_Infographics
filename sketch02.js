let slider;

let family;

let population;

let yearSimple;


let refugees;

let refugeeBubbles = [];
let donationBubbles = [];
let hostBubbles = [];

let year;
let mouseYear;

let countriesData;

let selectedYear;

let mode = 'refugees';
let refugeesButton, donationsButton, hostsButton;



// Max and Min data
let maxRefugees = 0;
let minRefugees = Infinity;

let maxDonations = 0;
let minDonations = Infinity;

let maxHosts = 0;
let minHosts = Infinity;


// images
let history = [];
let imageCount = 12; // Number of images to load

let haha;

let canvasWidth = 1500;






let timeLineX = 0;
let previousSliderValue = 2012;
let sliderDifference;
let currentSliderValue = 0;



let targetX = 0; // Initialize the target position of the timeline



let destinationX;
let speed = 20; // Adjust the speed here
let direction;


let bigger = false;

let s = 0; let a = 0;


let world;

function preload() {
  family = loadImage('images/family.png');

  world=loadImage('images/map.png');

  countriesData = loadJSON('world.json');

  historyData = loadJSON('history.json');

  for (let i = 0; i < imageCount; i++) {
    let imagePath = 'images/history/history' + i + '.png'; // Construct the image path
    history[i] = loadImage(imagePath); // Load the image and store it in the array
  }

  haha = loadImage('images/history/history1.png');
}

function setup() {
  createCanvas(canvasWidth, 2500);

  slider = createSlider(2012, 2023, 2012, 1); // Create a slider with range from 0 to 100 and initial value 50
  // slider.position(500, 50); // Position the slider
  slider.size(700);

  year = slider.value();

  selectedYear = slider.value();
  slider.input(updateSelectedYear);


  refugees = map(slider.value(), 2012, 2023, 21, 58);


  mouseYear = map(mouseX, 600, 1300, 2012, 2024);


  updateSelectedYear();



  // data of all countries
  for (let i = 0; i < countriesData.countries.length; i++) {

    console.log('selected', selectedYear);

    const country = countriesData.countries[i];
    // const dataForYear = country.years.find(item => item.year === selectedYear);
    const dataForYear = country.years.find(element => element.year === selectedYear);



    // data of all years
    for (let j = 0; j < country.years.length; j++) {
      const yearData = country.years[j];

      // refugee Data for all the years
      const refugeeData = yearData.refugees;
      const donationData = yearData.donation;
      const hostData = yearData.hosts;


      // Update max and min values for refugees
      if (refugeeData > maxRefugees) {
        maxRefugees = refugeeData;
      }

      if (refugeeData < minRefugees) {
        minRefugees = refugeeData;
      }


      // Update max and min values for donations
      if (donationData > maxDonations) {
        maxDonations = donationData;
      }

      if (donationData < minDonations) {
        minDonations = donationData;
      }


      // Update max and min values for hosts
      if (hostData > maxHosts) {
        maxHosts = hostData;
      }

      if (hostData < minHosts) {
        minHosts = hostData;
      }

    }




    if (dataForYear) {
      // Access the refugee count for the selected year
      const refugeeCount = dataForYear.refugees;
      const donationCount = dataForYear.donation;
      const hostCount = dataForYear.hosts;

      // convert to text
      const refugeeText = refugeeCount / 1000 + 'K';
      const donationText = '$'+donationCount / 1000 + 'K';
      const hostText = hostCount / 1000 + 'K';

      // country text
      const countryName = country.name;



      // Calculate the size of the bubble based on refugee count
      const refugeeBubbleSize = map(refugeeCount, minRefugees, maxRefugees, 30, 100);
      const donationBubbleSize = map(donationCount, minDonations, maxDonations, 30, 100);
      const hostBubbleSize = map(hostCount, minHosts, maxHosts, 30, 100);


      // Draw the bubble
      refugeeBubbles.push(new Bubble(country.bubbleX, country.bubbleY, refugeeBubbleSize, countryName, refugeeText));
      donationBubbles.push(new Bubble(country.bubbleX, country.bubbleY, donationBubbleSize, countryName, donationText));
      hostBubbles.push(new Bubble(country.bubbleX, country.bubbleY, hostBubbleSize, countryName, hostText));

      console.log(selectedYear, country.name, refugeeBubbleSize);
      console.log(country.bubbleX, country.bubbleY);



      // troubleshoot
    } else {
      console.log('No data found for year', selectedYear, 'in country', country.name);
    }

  }

  // refugees data
  refugeesButton = createButton('Population Displaced');
  refugeesButton.position(800, 650);
  refugeesButton.class('button');
  refugeesButton.mousePressed(function () {
    mode = 'refugees'
    updateButtonStyles();
  });

  // donations data
  donationsButton = createButton('Donation Amount');
  donationsButton.position(1050, 650);
  donationsButton.class('button');
  donationsButton.mousePressed(function () {
    mode = 'donations'
    updateButtonStyles();
  });

  // host data
  hostsButton = createButton('Participated Hosts');
  hostsButton.position(1300, 650);
  hostsButton.class('button');
  hostsButton.mousePressed(function () {
    mode = 'hosts'
    updateButtonStyles();
  });

  updateButtonStyles();







  // Initialize the ball position
  timeLineX = map(2012, 2012, 2023, 0, canvasWidth * 12);
  destinationX = timeLineX; // Initial destination is the same as starting position


  //   targetX = 0;
  // currentSliderValue = slider.value();



}




function draw() {
  background(241,252,234);

  image(world, 0, 800, 1500,900);

  


  // textAlign(TOP, LEFT);
noStroke();
  fill(233,255,137);
  rect(0,0,canvasWidth,150);



textSize(20);
  textAlign(LEFT,TOP);
  fill(0);
  let displacedPopulation='In a world increasingly marked by conflict and natural disasters, the number of displaced families is on the rise. Wars and environmental crises force countless individuals to flee their homes, seeking safety and shelter. Airbnb.org addresses this pressing need by providing temporary housing solutions for displaced families, offering a beacon of hope during their most challenging times.';
  text(displacedPopulation,100,350,700);


  // text()

  textAlign(LEFT,TOP);



  // if (timeLineX !== targetX) {
  //   let direction = (targetX - timeLineX > 0) ? 1 : -1;
  //   timeLineX += direction * speed;

  //   // Ensure it doesn't overshoot the target
  //   if ((direction === 1 && timeLineX > targetX) || (direction === -1 && timeLineX < targetX)) {
  //     timeLineX = targetX;
  //   }
  // }


  //   if(targetX>timeLineX){
  //   direction=-1;
  // }else if(targetX<timeLineX){
  //   direction=1;
  // }else{
  //   direction=0;
  // }

  if (timeLineX !== targetX) {
    // let direction = (targetX - timeLineX > 0) ? 1 : -1;

    if (targetX > timeLineX) {
      direction = 1;
    } else if (targetX < timeLineX) {
      direction = -1;
    }
    timeLineX += direction * speed;

    // Ensure it doesn't overshoot the target: could add it, but not necessary!

    // if ((direction === 1 && timeLineX > targetX) || (direction === -1 && timeLineX < targetX)) {
    //   timeLineX = targetX;
    // }
  }




  // currentSliderValue = slider.value();
  // sliderDifference = currentSliderValue - previousSliderValue;

  // for(let i=0;i<canvasWidth;i++){
  //   speed+=1;

  // }

  // timeLineX += sliderDifference*canvasWidth;
  // previousSliderValue = currentSliderValue;


  // for(let i=0;i<canvasWidth;i++){
  //   speed+=i
  // }






  // let targetX = map(year, 2012, 2013, 0, 1000);

  // Gradually move the ball towards the destination




  // console.log('timeline'+timeLineX);
  // console.log('target'+targetX);

  // Gradually move the timeline towards the target

  // if (direction !== 0) {
  //   timeLineX += direction * speed;


  // Ensure it doesn't overshoot the target

  // if ((direction === 1 && timeLineX > targetX) || (direction === -1 && timeLineX < targetX)) {
  //   timeLineX = targetX;

  // }
  // }


  // if (timeLineX !== targetX) {
  //   timeLineX += direction * speed;
  // } 


  // if ((direction == 1 && timeLineX >targetX) || (direction == -1 && timeLineX <targetX)) {
  //   timeLineX = targetX;
  // }

  // direction = (targetX - timeLineXX > 0) ? 1 : -1;
  // timeLineX += direction * speed;

  // ball.update(ballX);








  textAlign(CORNER, CORNER)

  fill(0);
  let coordinates = mouseX + "," + mouseY;
  // text(coordinates, mouseX+30, mouseY);




  // text(year,100,600);

  // text(selectedYear, 50, 400);

  // text(mouseYear, 50, 500);

  textAlign(TOP, LEFT);
  textSize(50);
  fill(3,92,122);
  text('Growing number of Displaced Families',100,200,500);

  image(family, 620, 250, 50, 50);


  textSize(30);

  if (slider.value() == 2012) {
    population = new Population(8);
    textAlign(LEFT,TOP);

    let refugee2012=historyData[0].refugee;
    text(refugee2012,670,270);

  } else if (slider.value() == 2013) {
    population = new Population(10);
    let refugee2013=historyData[1].refugee;
    text(refugee2013,670,270)
  } else if(slider.value()==2014){
    population = new Population(13);
    let refugee2014=historyData[2].refugee;
    text(refugee2014,670,270);
  }else if(slider.value()==2015){
    population = new Population(15);
    let refugee2015=historyData[3].refugee;
    text(refugee2015,670,270);
  }else if(slider.value()==2016){
    population = new Population(19);
    let refugee2016=historyData[4].refugee;
    text(refugee2016,670,270);
  }else if(slider.value()==2017){
    population = new Population(23);
    let refugee2017=historyData[5].refugee;
    text(refugee2017,670,270);
  }else if(slider.value()==2018){
    population = new Population(25);
    let refugee2018=historyData[6].refugee;
    text(refugee2018,670,270);
  }else if(slider.value()==2019){
    population = new Population(28);
    let refugee2019=historyData[7].refugee;
    text(refugee2019,670,270);
  }else if(slider.value()==2020){
    population = new Population(32);
    let refugee2020=historyData[8].refugee;
    text(refugee2020,670,270);
  }else if(slider.value()==2021){
    population = new Population(34);
    let refugee2021=historyData[9].refugee;
    text(refugee2021,670,270);
  }else if(slider.value()==2022){
    population = new Population(38);
    let refugee2022=historyData[10].refugee;
    text(refugee2022,670,270);
  }else if(slider.value()==2023){
    population = new Population(45);
    let refugee2023=historyData[11].refugee;
    text(refugee2023,670,270);
  }

  console.log(year);

  console.log("max" + minRefugees);

  push()
  translate(950,250)
  population.draw();
pop()
  // setInterval(() => {
  // population.toggle();
  // }, 1000);

  setInterval(() => {
    bigger = !bigger;
  }, 1000);


  scale(1);

  // console.log(timeLineX);
  // console.log(targetX);

  for (let i = 0; i < refugeeBubbles.length; i++) {
    if (mode === 'refugees') {
      refugeeBubbles[i].display();
    } else if (mode === 'donations') {
      donationBubbles[i].display();
    } else if (mode === 'hosts') {
      hostBubbles[i].display();
    }


  }

  // refugeeBubble.display();


  push();
  translate(-timeLineX, 1400);
  timeLine();
  pop();



  Slider();




  textSize(70);
  fill(3,92,122);
  textAlign(LEFT,TOP)

  text('Airbnb.org: Home for Displaced Families',100,50);


  textSize(50);

  fill(3,92,122);
  
  textAlign(LEFT,TOP);
  text('We Helped the Displaced Families via Donations and Free Hosts',100,600,700);

  textSize(50);
  // textAlign(TOP, LEFT);
  fill(3,92,122);
  text('What Have We Done for the Displaced Families',100,1750,600);


}



function Slider() {
  // Display the slider value



  let sliderY = mouseY - 10;
  let sliderText = mouseY;

  textSize(16);
  //   slider.position(50,constrain(sliderY, 50, height-50)); // Constrain slider within canvas bounds
  slider.position(600, sliderY);




  // slider location!!!


  //   under map
  if (mouseY < 1600 && mouseY > 800) {
    sliderText = 1600;

    sliderY = 1600;
    slider.position(600, sliderY)

    // above map
  } else if (mouseY > 8800 && mouseY < 1600) {
    sliderText = 800;

    sliderY = 800;
    slider.position(600, sliderY)

    // above top margin
  } else if (mouseY < 50) {
    sliderText = 50;

    sliderY = 50;
    slider.position(600, sliderY);

  } else if (mouseY > height - 50) {
    sliderText = height - 50;

    sliderY = height - 50;
    slider.position(600, sliderY);
  }



  push();

  // ruler year text
  translate(600, sliderText);
  // text("Year:  " + slider.value(), mouseX, -10);
  //   text("2012", 50, constrain(30, 50, height));

  fill(63,7,56,180);
  noStroke();
  rect(-20, -20, 780, 100,15);
  textAlign(LEFT,TOP)
  for (let i = 0; i < 12; i++) {
    fill(255);
    text(i + 2012, i * 60, 30)
  }

  pop();



}










class Bubble {
  constructor(x, y, size, country, dataText) {
    this.x = x;
    this.y = y;
    this.size = size;

    this.country = country;
    this.dataText = dataText;

    // this.distance=dist(mouseX, mouseY, this.x, this.y)
    // this.color = color;
  }

  display() {
    // Draw the bubble
    // fill(this.color);

    ellipseMode(CENTER);
    push();
    translate(this.x, this.y)
    let distance = dist(mouseX, mouseY, this.x, this.y)

    fill(63,7,56,200);

    if (distance < this.size / 2) {
      scale(2);
      fill(87,149,53,200)
    }






    noStroke();
    // fill(150);
    ellipse(0, 0, this.size, this.size);

    pop();

    textAlign(CENTER, CENTER)

    textSize(13);
    fill(233,255,137,200);
    text(this.country, this.x, this.y- 10);
    text(this.dataText, this.x,this.y+10);

    textAlign(CORNER, CORNER);
    textAlign(TOP,LEFT);



    

    ellipseMode(CORNER);
  }




}



// original bubble
class Bubble1 {
  constructor(country, refugees, hosts, donation) {
    this.country = country;
    this.refugees = refugees / 1000 + "K";
    this.hosts = hosts / 1000 + "K";
    this.donation = "$" + donation;

    this.refugeeSize = map(refugees, 3000, 800000, 10, 200);
    this.hostSize = map(hosts, 3000, 800000, 10, 200);
    this.donation = map(donation, 6000, 60000000, 10, 200)

  }

  draw() {

  }

  update() {

  }


}



// each image
class Family {
  constructor(familyX, familyY, familySize) {

  }
}



class Population {
  constructor(total) {
    this.size = 50;
    // this.rows=5;
    this.columns = 8;
    this.margin = 10;

    this.array = [];
    this.total = total;

    this.fullRow = floor(this.total / this.columns);
    this.remain = this.total % this.columns;
    // this.scale=1;

    // this.a+=0.04;
    // this.scale=cos(this.a)*2

    // this.scalingIncrement=0.05;

    // this.distance=dist(mouseX, mouseY, mouse, y2)

    this.a = 0;
    this.minScale = 1;
    this.maxScale = 1.1;
  }

  draw() {

    imageMode(CENTER)
    //  this.a += 0.04;
    //  s = cos(this.a) * (this.maxScale - 1) + 1;
    //  a = a + 0.04;
    //  s = sin(a) * 1;

    s = map(sin(frameCount * 0.07), -1, 1, this.minScale, this.maxScale);
    // s= 3*abs(sin(frameCount * 0.005));

 
    translate(0, 0);


    // if (bigger) {
    //   this.scale += 0.3;
    // } else {
    //   this.scale -= 0.3;
    // }

    // scale(this.scale);




    console.log('scale' + s);





    for (let i = 0; i < this.fullRow; i++) {
      for (let j = 0; j < this.columns; j++) {
        let x = j * (this.size + this.margin);
        let y = i * (this.size + this.margin);
        // scale(s);
        push()
        translate(x, y);
        scale(s);
        image(family, 0, 0, this.size, this.size);
        pop()
      }
    }

    scale(1);

    for (let k = 0; k < this.remain; k++) {
      let x = k * (this.size + this.margin);
      let y = this.fullRow * (this.size + this.margin);

      push()
      translate(x, y);
      scale(s);
      image(family, 0, 0, this.size, this.size);
      pop();

    }


    imageMode(CORNER);
  }


  // toggle() {
  //   // Toggle the scaling direction
  //   this.scalingIncrement *= -1;
  //   // Gradually scale up or down the images
  //   this.scale += this.scalingIncrement;
  //   // Ensure the scale remains within bounds
  //   this.scale = constrain(this.scale, 0.5, 2); // Adjust the bounds as needed
  // }


  // toggle() {
  //   bigger != bigger;
  // }

}






// function updateSelectedYear() {
//   // Update selected year when slider value changes
//   selectedYear = slider.value();
// }





function updateSelectedYear() {
  // Update selected year when slider value changes
  selectedYear = slider.value();

  refugeeBubbles = []; // Clear the array
  donationBubbles = [];
  hostBubbles = [];

  for (let i = 0; i < countriesData.countries.length; i++) {
    const country = countriesData.countries[i];
    const dataForYear = country.years.find(item => item.year === selectedYear);
    if (dataForYear) {
      // Access the refugee count for the selected year
      const refugeeCount = dataForYear.refugees;
      const donationCount = dataForYear.donation;
      const hostCount = dataForYear.hosts;

      // convert to text
      const refugeeText = refugeeCount / 1000 + 'K';
      const donationText = donationCount / 1000 + 'K';
      const hostText = hostCount / 1000 + 'K';

      // country text
      const countryName = country.name;

      // Calculate the size of the bubble based on refugee count
      const refugeeBubbleSize = map(refugeeCount, minRefugees, maxRefugees, 30, 100);
      const donationBubbleSize = map(donationCount, minDonations, maxDonations, 30, 100);
      const hostBubbleSize = map(hostCount, minHosts, maxHosts, 30, 100);


      // Draw the bubble
      refugeeBubbles.push(new Bubble(country.bubbleX, country.bubbleY, refugeeBubbleSize, countryName, refugeeText));
      donationBubbles.push(new Bubble(country.bubbleX, country.bubbleY, donationBubbleSize, countryName, donationText));
      hostBubbles.push(new Bubble(country.bubbleX, country.bubbleY, hostBubbleSize, countryName, hostText));

    }
  }


  targetX = map(selectedYear, 2012, 2023, 0, canvasWidth * 11);

}





function updateButtonStyles() {
  refugeesButton.removeClass('active');
  donationsButton.removeClass('active');
  hostsButton.removeClass('active');

  if (mode === 'refugees') {
    refugeesButton.addClass('active');

  } else if (mode === 'donations') {
    donationsButton.addClass('active');

  } else if (mode === 'hosts') {
    hostsButton.addClass('active');
  }
}





function timeLine() {
  for (let i = 0; i < imageCount; i++) {
    image(history[i], 100 + i * canvasWidth, 500, 800, 500);

    textAlign(LEFT, TOP);

    const historyDate = historyData[i];
    const historyTitle = historyDate.title;
    const historyParagraph = historyDate.paragraph;

    fill(3,92,122);
    textSize(28);
    text(historyTitle, 950 + i * canvasWidth, 530, 450);

    fill(0);
    textSize(20);
    text(historyParagraph, 950 + i * canvasWidth, 680,500);

  }
}