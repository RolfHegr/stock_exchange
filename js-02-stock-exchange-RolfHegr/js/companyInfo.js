class CompanyInfo {
  constructor(htmlElement, symbol) {
    this.htmlElement = htmlElement;
    this.symbol = symbol;
    this.createDivs();
  }

  createDivs() {
    const compInfo = document.getElementById("compInfo");
    const darkModeContainer = document.createElement("div");
    darkModeContainer.classList.add(
      "form-check",
      "form-switch",
      "d-flex",
      "justify-content-center",
      "pb-2"
    );
    darkModeContainer.setAttribute("id", "clickableDarkmode");
    darkModeContainer.innerHTML = `<input class="form-check-input" height="" type="checkbox" id="flexSwitchCheckChecked">
      <label class="form-check-label" for="flexSwitchCheckChecked">Darkmode</label>`;
    compInfo.prepend(darkModeContainer);

    const graphDiv = document.createElement("div");
    graphDiv.classList.add(
      "card-content",
      "d-flex",
      "flex-grow-0",
      "flex-shrink-1",
      "flex-row",
      "overflow-hidden"
    );
    graphDiv.setAttribute("id", "graphDiv");

    graphDiv.innerHTML = `<div id="innerGraphDiv" class="graph-container d-flex flex-grow-1 flex-shrink-1 mx-4">
        <canvas height="300" max-widt="1000" class="d-flex flex-grow-1 flex-shrink-1 justify-content-center"
            id="myChart" </canvas> </div>`;
    compInfo.prepend(graphDiv);

    const companyInformation = document.createElement("div");
    companyInformation.classList.add(
      "card-content",
      "d-flex",
      "flex-column",
      "mx-5",
      "m-2",
      "mt-3",
      "justify-start"
    );
    companyInformation.setAttribute("id", "companyInformation");
    companyInformation.innerHTML = ` <div class="d-flex flex-row justify-content-sm-between w-100 mt-1 align-items-center gap-2">
    <h1 id="stockHeader" class="display-5"></h1>
    <h2 id="stockSymbol" class=" mb-2"></h2>
    <div class="d-flex justify-content-center align-items-end mb-1 mt-1">
        <div id="spinner" class="mx-1 text-primary spinner-border invisible" role="status">
            <span class="sr-only"></span>
        </div>
    </div>
    <div class="d-flex justify-content-center align-items-center mt-2">
        <img id="stockImg" class="img-fluid rounded" height="75" width="75" alt="Stock Image Logo"
            src="https://financialmodelingprep.com/images-New-jpg/CAN.jpg" alt="company logo">
    </div>
    </div>
    <div class="card-content d-flex flex-row mt-3">
    <div id="stockPrice"></div>
    <div id="stockPercent" class="px-1"></div>
    </div>
    <div class="card-content d-flex flex-row mt-4">
    <div id="companyDescription" class="">
        <p>
        </p>
    </div>
    </div>`;
    compInfo.prepend(companyInformation);
  }

  spinnerInvisible() {
    document.getElementById("spinner").classList.add("invisible");
  }

  spinnerVisible() {
    document.getElementById("spinner").classList.remove("invisible");
  }

  async get(divElem, symbol) {
    await this.fetchCompanyEndpoint(this.symbol);

    //Darkmode
    document
      .getElementById("clickableDarkmode")
      .addEventListener("click", function (event) {
        const toggleBtn = document.getElementById("flexSwitchCheckChecked");
        const allElements = document.getElementsByTagName(
          "html",
          "body",
          "div",
          "h1",
          "p",
          "body",
          "button"
        );

        if (toggleBtn.checked === true) {
          for (const elem of allElements) {
            elem.classList.add("darkmode");
          }
        }
        if (toggleBtn.checked === false) {
          for (const elem of allElements) {
            elem.classList.remove("darkmode");
          }
        }
      });
  }

  async fetchCompanyEndpoint(companySymbol) {
    const URL = `https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/company/profile/${companySymbol}`;
    this.spinnerVisible();
    try {
      let response = await fetch(URL);
      if (response.ok) {
        const data = await response.json();
        this.buildsStockDisplay(data.profile);
      }
    } catch (err) {
      console.log("Error", err);
    }
  }

  //Calls all functions to create page
  buildsStockDisplay(obj) {
    this.createCompanyDescription(obj);
    this.createsHeaderSymbolPicture(obj);
    this.displaysStockPrice(obj);
    this.fetchPriceHistory(obj);
  }

  //Creates Company Photo
  createsHeaderSymbolPicture(obj) {
    const stockHeader = document.getElementById("stockHeader");
    const stockImg = document.getElementById("stockImg");
    let stockSymbol = document.getElementById("stockSymbol");

    stockHeader.innerHTML = obj.companyName;
    stockSymbol = this.symbol;
    stockImg.src = obj.image;
  }
  //Displays stock Price
  async displaysStockPrice(obj) {
    const stockPriceDiv = await document.getElementById("stockPrice");
    const stockPrice = obj.price;
    const stockPercentage = obj.changesPercentage;
    const currency = obj.currency;

    stockPriceDiv.innerHTML = `Stock Price <strong>$ <span id="companyStockprice"> ${stockPrice}${currency}</span></strong>`;
    this.displayChangeRedOrGreen(stockPercentage);
  }
  //Generates the company Description
  createCompanyDescription(obj) {
    const descriptionDiv = document.getElementById("companyDescription");
    const descriptionText = obj.description;
    const firstTwoSentences = this.shaveCompanyDescription(descriptionText);

    descriptionDiv.innerHTML = firstTwoSentences;
  }
  //Reduces description to the first 4 sentences
  shaveCompanyDescription(descriptionText) {
    const arrayOfSentences = descriptionText.split(".");
    let firstTwoSentences = "";
    for (let i = 0; i < 2; i++) {
      firstTwoSentences += arrayOfSentences[i].toString() + ".";
    }
    return firstTwoSentences;
  }
  //Displays change in percent in RED || GREEN
  displayChangeRedOrGreen(changePercent) {
    const stockPriceDiv = document.getElementById("stockPercent");
    const twoDecimals = changePercent.substr(0, 4);

    if (twoDecimals.includes("-")) {
      stockPriceDiv.classList.add("negative-percent");
      stockPriceDiv.innerHTML = `( ${twoDecimals}%)`;
    } else {
      stockPriceDiv.classList.add("positive-percent");
      stockPriceDiv.innerHTML = `( ${twoDecimals}%)`;
    }
  }

  /* BUILDING GRAPH */

  // addChart() {
  //   fetchPriceHistory(this.symbol)
  // }

  //fetching individual stock history
  fetchPriceHistory(symbol) {
    symbol = this.symbol;
    const priceHistoryURL = `https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/historical-price-full/${symbol}?serietype=line`;
    fetch(priceHistoryURL)
      .then((response) => response.json())
      .then((result) => {
        this.buildPriceHistoryGraph(result.historical);
        return result.historical;
        // return resultObj;
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  //building Chart Graph of Price History using Chart.js
  async buildPriceHistoryGraph(historicalResult) {
    await this.getPriceDates(historicalResult);
    await this.stockPrice(historicalResult);
    this.toggleSpinner();

    const ctx = document.getElementById("myChart").getContext("2d");
    const xlabels = this.getPriceDates(historicalResult);
    const prices = this.stockPrice(historicalResult);
    const myChart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: xlabels,
        datasets: [
          {
            label: "Stock Price USD",
            data: prices,
            backgroundColor: ["rgba(234, 55, 163)"],
            borderColor: ["rgba(234, 55, 163)"],

            borderWidth: 1,
          },
        ],
      },
      responsive: true,
      maintainAspectRatio: false,
      aspectRatio: 3,
      options: {
        scales: {
        },
      },
    });
  }

  //Fetches all history prices from company, returns ascending array of dates
  getPriceDates(array) {
    const arrOfDates = [];
    array.forEach((e) => {
      arrOfDates.unshift(e.date);
    });
    return arrOfDates;
  }

  stockPrice(array) {
    const priceArray = [];
    array.forEach((e) => {
      priceArray.unshift(e.close);
    });
    return priceArray;
  }

  //Should export from other doc or create a separate js file
  toggleSpinner() {
    const spinner = document.getElementById("spinner");
    if (spinner.classList.contains("invisible")) {
      spinner.classList.remove("invisible");
    } else {
      spinner.classList.add("invisible");
    }
  }
}
