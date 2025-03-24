using API.Entities;

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;

public class AdminController(UserManager<AppUser> userManager) : BaseApiController
{
    [Authorize(policy: "RequireAdminRole")]
    [HttpGet("users-with-roles")]
    public async Task<ActionResult> GetUsersWithRoles()
    {
        var users = await userManager.Users
            .OrderBy(u => u.UserName)
            .Select(u => new
            {
                u.Id,
                username = u.UserName,
                Roles = u.UserRoles.Select(r => r.Role.Name)
            }).ToListAsync();

        return Ok(users);
    }

    [Authorize(policy: "RequireAdminRole")]
    [HttpPost("edit-roles/{username}")]
    public async Task<ActionResult> EditRoles(string username, string roles)
    {
        if (string.IsNullOrEmpty(roles)) return BadRequest("Roles cannot be empty");
        if (string.IsNullOrEmpty(username)) return BadRequest("Username cannot be empty");

        var selectedRoles = roles.Split(',').ToArray();

        var user = await userManager.FindByNameAsync(username);
        if (user == null)
        {
            return NotFound("User not found");
        }

        var userRoles = await userManager.GetRolesAsync(user);
        var result = await userManager.RemoveFromRolesAsync(user, userRoles.Except(selectedRoles));
        if (!result.Succeeded)
        {
            return BadRequest("Failed to remove user roles");
        }

        result = await userManager.AddToRolesAsync(user, selectedRoles.Except(userRoles));
        if (!result.Succeeded)
        {
            return BadRequest("Failed to add user roles");
        }

        return Ok(await userManager.GetRolesAsync(user));
    }

    [Authorize(policy: "ModeratePhotoRole")]
    [HttpGet("moderate-photos")]
    public ActionResult ModeratePhotos()
    {
        return Ok("This is the admin controller");

    }
}
