/**
 * Tạo middleware Rate Limiter để giới hạn số lượng request từ mỗi IP
 * @param {Object} config - Cấu hình cho rate limiter
 * @param {number} config.windowMs - Thời gian cửa sổ tính bằng milliseconds (ví dụ: 60000 = 1 phút)
 * @param {number} config.maxRequest - Số request tối đa cho phép trong khoảng thời gian windowMs
 * @param {string} config.message - Thông báo lỗi khi vượt quá giới hạn
 * @returns {Function} Middleware function với signature (req, res, next)
 */
function createRateLimiter({ windowMs, maxRequest, message }) {
    /**
     * Object lưu trữ thông tin request của mỗi IP address
     * Cấu trúc: {
     *   "192.168.1.1": {
     *     count: 5,              // Số lượng request hiện tại
     *     startTime: 1706251379000  // Thời điểm bắt đầu cửa sổ (timestamp)
     *   }
     * }
     */
    const requests = {};
    return function rateLimiterMiddleware(req, res, next) {
        // Bước 1: Lấy IP address của client
        // req.ip được Express cung cấp, nếu không có thì lấy từ connection
        const ip = req.ip || req.connection.remoteAddress;

        // Bước 2: Lấy thời gian hiện tại (timestamp dạng milliseconds)
        const now = Date.now();

        // Bước 3: Kiểm tra xem IP này đã từng gửi request chưa
        if (!requests[ip]) {
            // Nếu chưa có trong hệ thống, tạo mới record cho IP này
            requests[ip] = {
                count: 1, // Đây là request đầu tiên
                startTime: now, // Ghi nhận thời điểm bắt đầu
            };

            // Cho phép request này đi tiếp
            return next();
        }

        // Bước 4: IP đã tồn tại, kiểm tra xem đã hết thời gian windowMs chưa
        const timeElapsed = now - requests[ip].startTime; // Tính thời gian đã trôi qua

        if (timeElapsed > windowMs) {
            // Nếu đã hết thời gian cửa sổ, reset lại counter
            // Bắt đầu cửa sổ thời gian mới
            requests[ip] = {
                count: 1, // Reset về 1 (request hiện tại)
                startTime: now, // Cập nhật thời điểm bắt đầu mới
            };

            // Cho phép request này đi tiếp
            return next();
        }

        // Bước 5: Vẫn còn trong cửa sổ thời gian, kiểm tra đã vượt quá giới hạn chưa
        if (requests[ip].count >= maxRequest) {
            // Đã vượt quá số lượng request cho phép
            // Trả về lỗi 429 (Too Many Requests) với thông báo tùy chỉnh
            return res.error(429, message);
        }

        // Bước 6: Chưa vượt quá giới hạn
        // Tăng counter lên 1 để đếm request hiện tại
        requests[ip].count++;

        // Cho phép request tiếp tục đến middleware/route tiếp theo
        next();
    };
}

/**
 * Export sẵn một instance của rate limiter với config mặc định
 * - windowMs: 15 phút (15 * 60 * 1000 milliseconds)
 * - maxRequest: 100 requests
 * - message: "Too many request"
 */
const apiRateLimiter = createRateLimiter({
    windowMs: 15 * 60 * 1000, // 15 phút
    maxRequest: 100, // Tối đa 100 requests
    message: "Too many requests",
});

// Export cả factory function và instance mặc định
module.exports = { createRateLimiter, apiRateLimiter };
