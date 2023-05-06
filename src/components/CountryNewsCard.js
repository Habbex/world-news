const CountryNewsCard = (properties) => {
  console.log(properties);
  if (properties) {
    const el = document.createElement("div");
    el.style.color = "black";
    el.style.width = `300px`;
    el.innerHTML = `
              <div style=" background-color: #fefefe;
              margin: auto;
              padding: 20px;
              border: 1px solid #888;
              width: 80%;">
                ${properties.admin}
              </div>
          `;
    el.style["pointer-events"] = "auto";
    el.style.cursor = "pointer";
    el.onclick = () => console.info("Hello");
    return el;
  }
};

export default CountryNewsCard;
