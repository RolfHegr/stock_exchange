class SearchResult {
  constructor(htmlElement) {
    this.htmlElement = htmlElement;
  }

  shouldBeGreenOrRed(changePercent) {
    if (changePercent.includes("-")) {
      return false;
    }
    return true;
  }

  spinnerInvisible() {
    document.getElementById("spinner").classList.add("invisible");
  }

  spinnerVisible() {
    document.getElementById("spinner").classList.remove("invisible");
  }

  removeResults() {
    document.getElementById("displayResults").innerText = null;
  }

  errorInvisible() {
    document.getElementById("error").classList.add("d-none");
  }

  errorVisible() {
    document.getElementById("error").classList.remove("d-none");
  }

  //fetches individual stock to display picture and price in search results
  async fetchIndividualCompany(companySymbol) {
    const URL = `https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/company/profile/${companySymbol}`;
    const arrayOfCompanyInfo = [];
    try {
      let response = await fetch(URL);
      if (response.ok) {
        const data = await response.json();
        console.log(" data.profile.image,", data.profile.image);
        arrayOfCompanyInfo.push(
          data.profile.image,
          data.profile.changesPercentage
        );
        return arrayOfCompanyInfo;
      }
    } catch (err) {
      console.log("Error", err);
    }
  }

  //Creates and appends search results to div #displayResults
  async createListElements(arrayOfObjects) {
    const resultsContainer = document.getElementById("displayResults");
    resultsContainer.innerHTML = null;
    let numOfCompanies = arrayOfObjects.length;

    //displaying dynamically,based on number of companies found
    if (numOfCompanies > 5) {
      resultsContainer.classList.add("displaySpaceBetween");
    } else {
      resultsContainer.classList.add("displayStart");
    }

    //Creating a search result for each object and appending it to #resultsContainer
    arrayOfObjects.forEach(async (item) => {
      let color;
      const arrayCompanyInfo = await this.fetchIndividualCompany(item.symbol);
      const imgSrc = arrayCompanyInfo[0];
      const percentage = arrayCompanyInfo[1].substr(0, 4);
      const percentInGreen = this.shouldBeGreenOrRed(percentage);
      const listTemplate = document.createElement("p");
      const pTags = document.getElementsByClassName("result-paragraph");

      if (percentInGreen) {
        color = "positive-percent";
      } else {
        color = "negative-percent";
      }

      //adding bootstrap classes to each element
      listTemplate.classList.add(
        "d-flex",
        "align-items-center",
        "justify-content-between",
        "mx-3",
        "mb-2",
        "h5",
        "result-paragraph"
      );

      //Highlighting search results
      const searchInputValue = document.getElementById("searchBar").value;
      const regex = new RegExp(searchInputValue, "gi");
      let highlightedName = "";
      let highlightedSymbol = "";

      const isDarkmode = document.getElementById("flexSwitchCheckChecked");

      if (isDarkmode.checked) {
        highlightedName = item.name.replace(
          regex,
          `<span class="highlighted highlighted-darkmode">${searchInputValue}</span>`
        );
        highlightedSymbol = item.symbol.replace(
          regex,
          `<span class="highlighted highlighted-darkmode">${searchInputValue}</span>`
        );
      } else {
        highlightedName = item.name.replace(
          regex,
          `<span class="highlighted">${searchInputValue}</span>`
        );
        highlightedSymbol = item.symbol.replace(
          regex,
          `<span class="highlighted">${searchInputValue}</span>`
        );
      }

      //Creating a compare button with functionality
      let compareStockBtn = document.createElement("button");
      compareStockBtn.innerHTML = "Compare";
      compareStockBtn.classList.add("btn", "btn-primary", "compare-btn");
      compareStockBtn.addEventListener("click", function () {
        console.log(item);
      });

      //Building each element,
      listTemplate.innerHTML = `
       <div class=""> <img src="${imgSrc}"
       onerror="this.onerror=null;this.src='../resources/default-img.png';" class="mx-2 rounded" width="40" height="40" alt=""><a class="search-result text-decoration-none" style="color: #0373f2;" href="company.html?symbol=${item.symbol}">
        ${highlightedName}</a> <span class="mx-1 secondary ">${highlightedSymbol}</span><span class="${color}" name="stock-percent"> (${percentage}%)</span><span class="invisible">${item.symbol}</span></div>`;
      listTemplate.append(compareStockBtn);
      resultsContainer.append(listTemplate);
    });
    this.spinnerInvisible();
  }

  // Sorts the arr of objects on Company Name
  sortSearchResults(arrayOfObjects) {
    const sortedArray = arrayOfObjects.sort((a, b) => {
      let fa = a.name.toLowerCase(),
        fb = b.name.toLowerCase();

      if (fa < fb) {
        return -1;
      }
      if (fa > fb) {
        return 1;
      }
      return 0;
    });
    this.createListElements(sortedArray);
  }

  //Gets inputVal from ../js/search.js  ->
  async renderResults(inputVal) {
    const URL = `https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/search?query=${inputVal}&limit=10&exchange=NASDAQ`;
    try {
      let response = await fetch(URL);
      if (response.ok) {
        const data = await response.json();
        if (data.length === 0) {
          this.removeResults();
          this.errorVisible();
          this.spinnerInvisible();
        } else {
          this.errorInvisible();
          this.sortSearchResults(data);
        }
      }
    } catch (err) {
      console.log("Error", err);
    }
  }
}
