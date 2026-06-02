package com.spqr.manager.dto;

public record ApiResponse<T>(boolean success, T data, String message) {
}
