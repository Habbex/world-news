const CountryNewsCard = (properties) => {
  if (properties) {
    const el = document.createElement("div");
    el.style.color = "black";
    el.style.width = `300px`;
    el.innerHTML = `
    <div id="newsCard"; style="position: relative; z-index: 4; min-width: 108px; padding: 10px 14px;background: #FFFFFF;border: 1px solid #E5E5E5;box-shadow: 0px 2px 20px rgba(32, 32, 35, 0.13);border-radius: 4px;">
      <div style="font-family: 'Open sans', sans-serif; margin-bottom:10px;font-weight: 600;font-size: 13px;line-height: 16px;text-transform: capitalize;color: #2D3032;">
        ${properties.admin}
      </div>
      <div style="font-family: 'Open sans', sans-serif;font-size: 13px;line-height: 16px;color: #3E4850;">
        Visitors: 1000
      </div>
    </div>
  `;
    return el;
  } else {
    return null;
  }
};

export default CountryNewsCard;
