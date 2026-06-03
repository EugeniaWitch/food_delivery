using DeliveryFood.API.Data;
using DeliveryFood.API.DTOs;
using DeliveryFood.API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Text.RegularExpressions;

namespace DeliveryFood.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _db;
        private readonly IConfiguration _config;

        public AuthController(AppDbContext db, IConfiguration config)
        {
            _db = db;
            _config = config;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto dto)
        {
            var emailRegex = new Regex(@"^[^@\s]+@[^@\s]+\.[^@\s]{2,}$");
            if (!emailRegex.IsMatch(dto.Email))
                return BadRequest(new { message = "Некорректный формат email" });

            var domain = dto.Email.Split('@')[1];
            var validDomains = new[] { "gmail.com", "yahoo.com", "outlook.com", "hotmail.com",
                                       "mail.ru", "yandex.ru", "icloud.com", "protonmail.com" };
            if (!validDomains.Contains(domain.ToLower()))
                return BadRequest(new { message = "Домен почты не поддерживается. Используйте gmail.com, mail.ru, yandex.ru и др." });

            if (dto.Password.Length < 6)
                return BadRequest(new { message = "Пароль должен содержать минимум 6 символов" });

            if (await _db.Users.AnyAsync(u => u.Email == dto.Email))
                return BadRequest(new { message = "Пользователь с таким email уже существует" });

            var user = new User
            {
                Email = dto.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password)
            };

            _db.Users.Add(user);
            await _db.SaveChangesAsync();

            return Ok(new { message = "Регистрация прошла успешно!" });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto dto)
        {
            // Специальный вход для администратора
            if (dto.Email == "root" && dto.Password == "root")
            {
                var adminUser = await _db.Users.FirstOrDefaultAsync(u => u.Role == "admin");
                if (adminUser == null)
                {
                    adminUser = new User
                    {
                        Email = "admin@fooddelivery.ru",
                        PasswordHash = BCrypt.Net.BCrypt.HashPassword("root"),
                        Role = "admin"
                    };
                    _db.Users.Add(adminUser);
                    await _db.SaveChangesAsync();
                }
                var adminToken = GenerateJwtToken(adminUser);
                return Ok(new AuthResponseDto
                {
                    Token = adminToken,
                    Email = adminUser.Email,
                    UserId = adminUser.Id,
                    Role = "admin"
                });
            }

            var user = await _db.Users.FirstOrDefaultAsync(u => u.Email == dto.Email);
            if (user == null || !BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
                return Unauthorized(new { message = "Неверный email или пароль" });

            var token = GenerateJwtToken(user);
            return Ok(new AuthResponseDto
            {
                Token = token,
                Email = user.Email,
                UserId = user.Id,
                Role = user.Role
            });
        }

        private string GenerateJwtToken(User user)
        {
            var jwtSettings = _config.GetSection("JwtSettings");
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings["SecretKey"]!));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Role, user.Role)
            };

            var token = new JwtSecurityToken(
                issuer: jwtSettings["Issuer"],
                audience: jwtSettings["Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddDays(double.Parse(jwtSettings["ExpiryDays"]!)),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}