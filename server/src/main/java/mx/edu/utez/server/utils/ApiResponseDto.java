package mx.edu.utez.server.utils;

import lombok.Data;
import org.springframework.http.HttpStatus;

@Data
public class ApiResponseDto {
    private Object data;
    private HttpStatus status;
    private boolean success;
    private String message;
}
