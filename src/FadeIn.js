import React, { useEffect } from "react";

export default function FadeIn(props) {
  useEffect(() => {
 var text = document.getElementById('text');
        var newDom = '';
        var animationDelay = 6;

          text.innerText.map(d => <span>{d == ' ' ? '&nbsp' : d} </span>)

        text.innerHTML = newDom;
        var length = text.children.length;

        for(let i = 0; i < length; i++)
        {
            text.children[i].style['animation-delay'] = animationDelay * i + 'ms';
        }
  }, [ ])
  return (
    <p id="text">
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Cupiditate
      incidunt praesentium, rerum voluptatem in reiciendis officia harum
      repudiandae tempore suscipit ex ea, adipisci ab porro.
    </p>
  );
}
