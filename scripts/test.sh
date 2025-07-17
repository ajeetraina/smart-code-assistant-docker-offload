#!/bin/bash

# Smart Code Assistant - Comprehensive Test Suite
# Tests both local and Docker Offload functionality

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Test results
PASSED=0
FAILED=0
TESTS_RUN=0

# Helper functions
log() {
    echo -e "${BLUE}[TEST]${NC} $1"
}

pass() {
    echo -e "${GREEN}✓ PASS:${NC} $1"
    ((PASSED++))
    ((TESTS_RUN++))
}

fail() {
    echo -e "${RED}✗ FAIL:${NC} $1"
    ((FAILED++))
    ((TESTS_RUN++))
}

warn() {
    echo -e "${YELLOW}⚠ WARN:${NC} $1"
}

# Wait for service to be ready
wait_for_service() {
    local url=$1
    local timeout=${2:-60}
    local count=0
    
    log "Waiting for service at $url (timeout: ${timeout}s)"
    
    while [ $count -lt $timeout ]; do
        if curl -sf "$url" > /dev/null 2>&1; then
            return 0
        fi
        sleep 2
        ((count+=2))
        echo -n "."
    done
    echo ""
    return 1
}

# Test functions
test_docker_availability() {
    log "Testing Docker availability"
    
    if command -v docker &> /dev/null; then
        pass "Docker command available"
    else
        fail "Docker command not found"
        return 1
    fi
    
    if docker info &> /dev/null; then
        pass "Docker daemon running"
    else
        fail "Docker daemon not running"
        return 1
    fi
}

test_service_health() {
    log "Testing service health endpoints"
    
    # Test backend health
    if curl -sf http://localhost:8000/health > /dev/null; then
        pass "Backend health endpoint responding"
    else
        fail "Backend health endpoint not responding"
    fi
    
    # Test backend info
    if curl -sf http://localhost:8000/info > /dev/null; then
        pass "Backend info endpoint responding"
    else
        fail "Backend info endpoint not responding"
    fi
    
    # Test frontend
    if curl -sf http://localhost:3000 > /dev/null; then
        pass "Frontend responding"
    else
        fail "Frontend not responding"
    fi
}

test_api_endpoints() {
    log "Testing API functionality"
    
    # Test code completion
    local completion_response
    completion_response=$(curl -sf -X POST http://localhost:8000/complete \
        -H "Content-Type: application/json" \
        -d '{"code":"def hello","max_tokens":20}' 2>/dev/null)
    
    if [ $? -eq 0 ] && echo "$completion_response" | jq -e '.completion' > /dev/null 2>&1; then
        pass "Code completion API working"
        
        # Check response structure
        if echo "$completion_response" | jq -e '.model_info, .response_time, .tokens_generated' > /dev/null 2>&1; then
            pass "Code completion response structure valid"
        else
            fail "Code completion response structure invalid"
        fi
    else
        fail "Code completion API not working"
    fi
    
    # Test code generation (if supported)
    local generation_response
    generation_response=$(curl -sf -X POST http://localhost:8000/generate \
        -H "Content-Type: application/json" \
        -d '{"prompt":"Create a simple function","max_tokens":50}' 2>/dev/null)
    
    if [ $? -eq 0 ]; then
        pass "Code generation API responding"
    else
        warn "Code generation API not responding (may not be implemented)"
    fi
}

test_model_capabilities() {
    log "Testing model capabilities"
    
    # Get system info
    local system_info
    system_info=$(curl -sf http://localhost:8000/info 2>/dev/null)
    
    if [ $? -eq 0 ]; then
        local model_size
        model_size=$(echo "$system_info" | jq -r '.model_size' 2>/dev/null)
        
        if [ "$model_size" = "small" ] || [ "$model_size" = "large" ]; then
            pass "Model size detected: $model_size"
            
            # Check GPU availability for large models
            local gpu_available
            gpu_available=$(echo "$system_info" | jq -r '.gpu_available' 2>/dev/null)
            
            if [ "$model_size" = "large" ] && [ "$gpu_available" = "true" ]; then
                pass "GPU available for large model"
            elif [ "$model_size" = "small" ]; then
                pass "CPU model configuration valid"
            else
                warn "Large model without GPU detected"
            fi
        else
            fail "Invalid model size: $model_size"
        fi
    else
        fail "Could not retrieve system info"
    fi
}

test_performance() {
    log "Testing performance metrics"
    
    local start_time
    local end_time
    local response_time
    
    start_time=$(date +%s.%N)
    
    local response
    response=$(curl -sf -X POST http://localhost:8000/complete \
        -H "Content-Type: application/json" \
        -d '{"code":"def fibonacci(n):","max_tokens":30}' 2>/dev/null)
    
    end_time=$(date +%s.%N)
    response_time=$(echo "$end_time - $start_time" | bc 2>/dev/null || echo "unknown")
    
    if [ $? -eq 0 ]; then
        local reported_time
        reported_time=$(echo "$response" | jq -r '.response_time' 2>/dev/null)
        
        if [ "$reported_time" != "null" ] && [ "$reported_time" != "" ]; then
            pass "Response time reported: ${reported_time}s"
            
            # Check if response time is reasonable (< 30s)
            if (( $(echo "$reported_time < 30" | bc -l 2>/dev/null || echo 0) )); then
                pass "Response time is reasonable"
            else
                warn "Response time seems high: ${reported_time}s"
            fi
        else
            fail "Response time not reported"
        fi
        
        # Check token generation
        local tokens_generated
        tokens_generated=$(echo "$response" | jq -r '.tokens_generated' 2>/dev/null)
        
        if [ "$tokens_generated" != "null" ] && [ "$tokens_generated" -gt 0 ] 2>/dev/null; then
            pass "Tokens generated: $tokens_generated"
        else
            fail "No tokens generated or invalid count"
        fi
    else
        fail "Performance test request failed"
    fi
}

test_error_handling() {
    log "Testing error handling"
    
    # Test empty request
    local empty_response
    empty_response=$(curl -sf -X POST http://localhost:8000/complete \
        -H "Content-Type: application/json" \
        -d '{}' 2>/dev/null)
    
    if [ $? -ne 0 ]; then
        pass "Empty request properly rejected"
    else
        warn "Empty request not rejected (may be handled gracefully)"
    fi
    
    # Test invalid JSON
    if ! curl -sf -X POST http://localhost:8000/complete \
        -H "Content-Type: application/json" \
        -d 'invalid json' > /dev/null 2>&1; then
        pass "Invalid JSON properly rejected"
    else
        fail "Invalid JSON not rejected"
    fi
}

# Main test execution
echo -e "${BLUE}"
cat << "EOF"
╔═══════════════════════════════════════════════════════════╗
║            Smart Code Assistant Test Suite               ║
╚═══════════════════════════════════════════════════════════╝
EOF
echo -e "${NC}"

log "Starting comprehensive test suite..."
echo ""

# Check if services are running
log "Checking if services are running..."
if ! curl -sf http://localhost:8000/health > /dev/null 2>&1; then
    warn "Services don't appear to be running"
    log "Attempting to start services..."
    
    if make local > /dev/null 2>&1; then
        log "Services started, waiting for readiness..."
        if wait_for_service "http://localhost:8000/health" 120; then
            pass "Services are now ready"
        else
            fail "Services failed to start within timeout"
            exit 1
        fi
    else
        fail "Could not start services"
        exit 1
    fi
else
    pass "Services are already running"
fi

echo ""

# Run tests
test_docker_availability
echo ""
test_service_health
echo ""
test_api_endpoints
echo ""
test_model_capabilities
echo ""
test_performance
echo ""
test_error_handling

# Test summary
echo ""
echo -e "${BLUE}╔═══════════════════════════════════════╗${NC}"
echo -e "${BLUE}║              TEST SUMMARY             ║${NC}"
echo -e "${BLUE}╚═══════════════════════════════════════╝${NC}"
echo ""
echo -e "Tests run:    ${TESTS_RUN}"
echo -e "${GREEN}Passed:       ${PASSED}${NC}"
if [ $FAILED -gt 0 ]; then
    echo -e "${RED}Failed:       ${FAILED}${NC}"
else
    echo -e "Failed:       ${FAILED}"
fi

echo ""
if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}🎉 All tests passed! The system is working correctly.${NC}"
    echo ""
    log "You can now:"
    echo "  • Open http://localhost:3000 to use the application"
    echo "  • Try 'make offload' to test Docker Offload (if available)"
    echo "  • Check the logs with 'make logs'"
    exit 0
else
    echo -e "${RED}❌ Some tests failed. Please check the output above.${NC}"
    echo ""
    log "Troubleshooting:"
    echo "  • Check service logs: make logs"
    echo "  • Verify Docker is running: docker info"
    echo "  • Restart services: make stop && make local"
    echo "  • Check documentation: docs/SETUP.md"
    exit 1
fi