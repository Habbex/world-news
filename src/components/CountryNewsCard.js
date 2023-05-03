const CountryNewsCard = (properties) => {
    console.log(properties);
    if (properties) {
      const el = document.createElement('div')
      el.style="position: relative; z-index: 4; min-width: 108px; padding: 10px 14px;background: #FFFFFF;border: 1px solid #E5E5E5;box-shadow: 0px 2px 20px rgba(32, 32, 35, 0.13);border-radius: 4px;"
      el.innerHTML= `
              <div style="font-family: 'Open sans', sans-serif; margin-bottom:10px;font-weight: 600;font-size: 13px;line-height: 16px;text-transform: capitalize;color: #2D3032;">
                ${properties.properties.ADMIN}
              </div>
          `
      return el
    }
  };

  export default CountryNewsCard