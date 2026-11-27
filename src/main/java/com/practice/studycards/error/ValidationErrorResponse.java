package com.practice.studycards.error;

import java.util.Map;

public record ValidationErrorResponse(int status, String message, Map<String, String> fieldErrors) {

}
