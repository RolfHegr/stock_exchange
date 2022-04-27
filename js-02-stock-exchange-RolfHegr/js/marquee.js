class Marquee {
  constructor(htmlElement) {
    this.htmlElement = htmlElement;
  }

  load() {
    const url = `https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/stock_market/actives`;
    fetch(url)
      .then((response) => response.json())
      .then((result) => {
        const marqueeContainer = document.createElement("div");
        marqueeContainer.setAttribute("id", "marqueeContainer");
        this.htmlElement.append(marqueeContainer);

        result.forEach(async (elem) => {
          let color;
          const symbol = elem.symbol;
          const price = elem.price.toString().substr(0, 5);
          const change = elem.change.toString().substr(0, 4);
          const changesPercentage = elem.changesPercentage
            .toString()
            .substr(0, 4);

          function changePercent(decimalNumber) {
            if (decimalNumber.indexOf("-")) {
              return true;
            }
            return false;
          }
          const percentInGreen = await changePercent(change);

          if (percentInGreen === true) {
            color = "positive-percent";
          } else {
            color = "negative-percent";
          }

          const newMarquee = document.createElement("span");
          newMarquee.classList.add("marquee-item");
          newMarquee.innerHTML = `<span class="px-1 "><strong>${elem.symbol}</strong></span> <span class="px-1"> ${elem.price} </span>
              <span class="stock-change px-2 ${color}"> ${change}</span><span class="px2"${changesPercentage}% </span>`;

          document.getElementById("marqueeContainer").append(newMarquee);
        });
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }
}
