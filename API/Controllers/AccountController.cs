using API.DTOs;
using API.Entities;
using API.Interfaces;

using AutoMapper;

using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;

public class AccountController(UserManager<AppUser> userManager, ITokenService tokenService,
    IMapper mapper) : BaseApiController
{
    [HttpPost("register")]
    public async Task<ActionResult<UserDto>> Register(RegisterDto dto)
    {
        if (await UserExists(dto.Username).ConfigureAwait(false)) return BadRequest("Username is taken");

        var user = mapper.Map<RegisterDto, AppUser>(dto);

        user.UserName = dto.Username.ToLower();

        var result = await userManager.CreateAsync(user, dto.Password).ConfigureAwait(false);
        if (!result.Succeeded) return BadRequest(result.Errors);

        return new UserDto
        {
            Username = user.UserName,
            Token = await tokenService.CreateToken(user),
            Gender = user.Gender,
            KnownAs = user.KnownAs

        };
    }

    [HttpPost("login")]
    public async Task<ActionResult<UserDto>> Login(LoginDto dto)
    {
        var user = await userManager.Users
        .Include(x => x.Photos)
        .SingleOrDefaultAsync(x => x.NormalizedUserName == dto.Username.ToUpper())
        .ConfigureAwait(false);

        if (user == null || user.UserName == null) return Unauthorized("Invalid username");

        var result = await userManager.CheckPasswordAsync(user, dto.Password).ConfigureAwait(false);
        if (!result) return Unauthorized("Invalid password");

        return new UserDto
        {
            Username = user.UserName,
            KnownAs = user.KnownAs,
            Gender = user.Gender,
            Token = await tokenService.CreateToken(user),
            PhotoUrl = user.Photos.FirstOrDefault(x => x.IsMain)?.Url
        };
    }

    private async Task<bool> UserExists(string username)
    {
        return await userManager.Users.AnyAsync(x => x.NormalizedUserName == username.ToUpper()).ConfigureAwait(false);
    }
}
