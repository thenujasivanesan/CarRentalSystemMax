using Microsoft.AspNetCore.Mvc;

namespace CarRentalSystem.Controllers
{
    public class PagesController : Controller
    {
        public IActionResult Privacy()
        {
            ViewData["Title"] = "Privacy Policy";
            return View();
        }

        public IActionResult Terms()
        {
            ViewData["Title"] = "Terms & Conditions";
            return View();
        }

        public IActionResult About()
        {
            ViewData["Title"] = "About Us";
            return View();
        }

        public IActionResult Contact()
        {
            ViewData["Title"] = "Contact Us";
            return View();
        }

        [HttpPost]
        public IActionResult SendMessage(string Name, string Email, string Message)
        {
            // For now, just show confirmation
            ViewBag.Success = $"Thanks {Name}, we received your message!";
            ViewData["Title"] = "Contact Us";
            return View("Contact");
        }
    }
}
