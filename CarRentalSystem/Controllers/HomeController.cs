using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CarRentalSystem.Data;
using CarRentalSystem.Models;
using System.Diagnostics;

namespace CarRentalSystem.Controllers
{
    public class HomeController : BaseController
    {
        private readonly ApplicationDbContext _context;

        public HomeController(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IActionResult> Index(string searchTerm = "", int? seats = null)
        {
            var carsQuery = _context.Cars.AsQueryable();

            // By default, show only available cars
            carsQuery = carsQuery.Where(c => c.IsAvailable == true);

            // Apply filters
            if (!string.IsNullOrEmpty(searchTerm))
            {
                carsQuery = carsQuery.Where(c => c.CarName.Contains(searchTerm) ||
                                               c.CarModel.Contains(searchTerm) ||
                                               c.Brand.Contains(searchTerm));
            }

            if (seats.HasValue)
            {
                if (seats.Value == 8)
                {
                    // 8+ seats means 8 or more
                    carsQuery = carsQuery.Where(c => c.Seats >= 8);
                }
                else
                {
                    carsQuery = carsQuery.Where(c => c.Seats == seats.Value);
                }
            }

            var cars = await carsQuery.ToListAsync();


            ViewBag.SearchTerm = searchTerm;
            ViewBag.Seats = seats;
            ViewBag.IsLoggedIn = IsLoggedIn;
            ViewBag.IsCustomer = IsCustomer;

            return View(cars);
        }

        public async Task<IActionResult> Cars(string searchTerm = "", int? seats = null, string availability = "")
        {
            var carsQuery = _context.Cars.AsQueryable();

            // Show all cars (both available and unavailable) on the Cars page
            // Apply filters
            if (!string.IsNullOrEmpty(searchTerm))
            {
                carsQuery = carsQuery.Where(c => c.CarName.Contains(searchTerm) ||
                                               c.CarModel.Contains(searchTerm) ||
                                               c.Brand.Contains(searchTerm));
            }

            if (seats.HasValue)
            {
                if (seats.Value == 8)
                {
                    // 8+ seats means 8 or more
                    carsQuery = carsQuery.Where(c => c.Seats >= 8);
                }
                else
                {
                    carsQuery = carsQuery.Where(c => c.Seats == seats.Value);
                }
            }

            // Apply availability filter
            if (!string.IsNullOrEmpty(availability))
            {
                if (availability == "available")
                {
                    carsQuery = carsQuery.Where(c => c.IsAvailable == true);
                }
                else if (availability == "booked")
                {
                    carsQuery = carsQuery.Where(c => c.IsAvailable == false);
                }
                // If availability is "all" or any other value, show all cars (no filter)
            }

            var cars = await carsQuery.ToListAsync();

            // Set ViewBag properties for the view
            ViewBag.SearchTerm = searchTerm;
            ViewBag.Seats = seats;
            ViewBag.Availability = availability;
            ViewBag.IsLoggedIn = IsLoggedIn;
            ViewBag.IsCustomer = IsCustomer;

            return View(cars);
        }

        public async Task<IActionResult> CarDetails(int id)
        {
            var car = await _context.Cars.FindAsync(id);
            if (car == null)
            {
                return NotFound();
            }

            ViewBag.IsLoggedIn = IsLoggedIn;
            ViewBag.IsCustomer = IsCustomer;

            return View(car);
        }



        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}
