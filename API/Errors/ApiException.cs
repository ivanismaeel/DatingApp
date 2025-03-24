namespace API.Errors;

public class ApiException(int statusCode, string message, string? details) : Exception
{
    public int StatusCode { get; set; } = statusCode;
    public override string Message { get; } = message;
    public string? Details { get; set; } = details;
}
