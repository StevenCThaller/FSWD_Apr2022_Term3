# Research: Blazor

1. Identify the "Why"
I have experience building C# apps, but as time goes on, I find fewer resources for the methods I learned, and more resources for this thing called Blazor that I have never used, and I would like to become more proficient in using C# to build web applications.

2. List Assumptions and Prior Knowledge
I think Blazor is a front end framework for C# applications. I think it is created by Microsoft. 

3. Ask Questions
   - What is Blazor?
   - What are other/equivalent options?
   - How/does Blazor compare to something like React?
   - Is Blazor limited to a specific version of C#?
   - Is Blazor cross-compatible with other languages such as JavaScript?
   - Can I make Database Queries directly from a Blazor application?
   - Is there even such thing as a "Blazor Application?"
   - What's so good about Blazor?
   - What are the downsides of Blazor?
   - How old is Blazor?
   - Is it developed by Microsoft?
   - What's the market share for Blazor apps?

4. Find Resources
   - https://dotnet.microsoft.com/en-us/apps/aspnet/web-apps/blazor
   - https://en.wikipedia.org/wiki/Blazor
   - https://blazor-university.com/overview/what-is-blazor/
   - https://demos.devexpress.com/blazor/
   - https://blazorfiddle.com/
   - https://www.yogihosting.com/category/blazor/
   - https://www.webtrainingroom.com/aspnetcore/blazor-tutorial
   - https://scientificprogrammer.net/2019/08/18/pros-and-cons-of-blazor-for-web-development/
   - https://medium.com/codex/blazor-server-vs-blazor-web-assembly-866a44bfebc


5. Answer Questions
  - Blazor is a front-end framework that takes the Razor functionality of ASP.NET, but has it run in the Browser (Blazor is a portmanteau of Browser and Razor)
  - Vanilla Razor, but this removes SPA functionality for the most part, and other front-end frameworks, but they are not a full replacement (in order to fully mimic the functionality of a base Razor application, you would need to add quite a bit to something like a React app)
  - In React, all of the event logic and DOM changes are handled, processed, and updated directly in the client browser. However, Blazor has a persistent connection (i.e. a socket connection, the C# equivalent of which is SignalR), and the events are handled and processed on the SERVER, while the browser updates the DOM. So it differs in that most of the logic is handled server-side rather than client-side.
  - Blazor requires ASP.NET v3.1 or later
  - Blazor allows you to make calls to C# functions from Javascript, and vise versa (this is referred to as JavaScript Interoperability)
  - You may technically be able to directly send a query to a database, but natively, even making a DB query from the client side involves invoking a server-side function call that in turn queries the database, so it is not direct, it's just removing the middleman of "send HTTP request to endpoint that calls function that queries database", instead "call function that queries database."
  - Pros: If you know C# but not JavaScript, you can still make dynamic web applications without learning a new language. You don't need to rely on HTTP requests. Updates over the SignalR connection will only return the updated portions of the DOM, so you are not worrying about sending full DOMs over the net.
  - Cons: If you don't know C#, you have to learn it first. Relies on a WebAssembly which is not available on all browsers. Also, .NET tooling is not as widely used/supported as JavaScript for web dev. Because all client-side events are handled, processed, and updated server-side, that's more $ you gotta spend.

6. Summarize and Share

