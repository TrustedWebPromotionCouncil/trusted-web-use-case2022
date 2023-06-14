#!/bin/bash

set -ue

BASEURI="https://trusted-web-prod.getunid.io"

AUTH_USER="ttec-cg"
AUTH_PASS="ttec-cg"

OPERATION=""
ADMIN_EMAIL=""
EMAIL=""

HELP() {
    echo ""
    echo "Usage: $(basename $0) -o [add|resetPassword|delete] -a admin_email -u email"
    echo ""
    exit 1
}

IS_ADD() {
    [[ "${1}" == "add" ]] && return 0 || return 1
}

IS_RESET_PASSWORD() {
    [[ "${1}" == "resetPassword" ]] && return 0 || return 1
}

IS_DELETE() {
    [[ "${1}" == "delete" ]] && return 0 || return 1
}

GRAPHQL() {
    ADMIN_EMAIL="${1}"
    QUERY="${2}"
    
    read -p "管理者パスワード: " ADMIN_PASSWORD
    echo ""

    # ユーザー認証
    unset OPTS && OPTS=(
        "-X" "POST"
        "-u" "${AUTH_USER}:${AUTH_PASS}"
        "-H" "Content-Type: application/json"
        "-d" "{\"email\": \"${ADMIN_EMAIL}\", \"password\": \"${ADMIN_PASSWORD}\"}"
    )
    RET="$( curl -v "${OPTS[@]}" "${BASEURI}/api/sign-in" 2>&1 )"

    # レスポンスチェック
    echo "${RET}" | grep "< set-cookie: " > /dev/null || {
        echo "Error: ユーザー認証できませんでした"
        HELP
    }

    # Cookie 取得
    COOKIE="$( echo "${RET}" | grep "< set-cookie: " | sed -e 's/< set-cookie: //' | sed -e 's/;.*//' )"

    # GraphQL リクエスト
    unset OPTS && OPTS=(
        "-X" "POST"
        "-u" "${AUTH_USER}:${AUTH_PASS}"
        "-H" "Content-Type: application/json"
        "-H" "Cookie: ${COOKIE}"
        "-d" "${QUERY}"
    )
    curl "${OPTS[@]}" "${BASEURI}/api/graphql"
}

while getopts 'a:o:u:h' opt; do
    case "$opt" in
        a)
            ADMIN_EMAIL="$OPTARG"
            ;;
        o)
            OPERATION="$OPTARG"
            ;;
        u)
            EMAIL="$OPTARG"
            ;;
        ?|h)
            HELP
            ;;
    esac
done

shift "$(($OPTIND -1))"

# NULL チェック
[[ "X${OPERATION}" == "X" ]] && HELP
[[ "X${ADMIN_EMAIL}" == "X" ]] && HELP
[[ "X${EMAIL}" == "X" ]] && HELP

# バリデーション
IS_ADD "${OPERATION}" || IS_RESET_PASSWORD "${OPERATION}" || IS_DELETE "${OPERATION}" || HELP

# ユーザー追加
IS_ADD "${OPERATION}" && {
    echo "[ユーザー追加]"
    echo "- メールアドレス: ${EMAIL}"
    read -p "- パスワード: " PASSWORD
    echo ""

    QUERY="{
        \"query\": \"mutation (\$email: String!, \$password: String!) { addUser (email: \$email, password: \$password) { id } }\",
        \"variables\": {
            \"email\": \"${EMAIL}\",
            \"password\": \"${PASSWORD}\"
        }
    }"

    GRAPHQL "${ADMIN_EMAIL}" "${QUERY}"
}

# パスワードのリセット
IS_RESET_PASSWORD "${OPERATION}" && {
    echo "[パスワードリセット]"
    echo "- メールアドレス: ${EMAIL}"
    read -p "- パスワード: " PASSWORD
    echo ""

    QUERY="{
        \"query\": \"mutation (\$email: String!, \$password: String!) { resetPassword (email: \$email, password: \$password) { id } }\",
        \"variables\": {
            \"email\": \"${EMAIL}\",
            \"password\": \"${PASSWORD}\"
        }
    }"

    GRAPHQL "${ADMIN_EMAIL}" "${QUERY}"
}

# ユーザー削除
IS_DELETE "${OPERATION}" && {
    echo "[ユーザー削除]"
    echo "- メールアドレス: ${EMAIL}"
    echo ""

    QUERY="{
        \"query\": \"mutation (\$email: String!) { removeUser (email: \$email) { id } }\",
        \"variables\": {
            \"email\": \"${EMAIL}\"
        }
    }"

    GRAPHQL "${ADMIN_EMAIL}" "${QUERY}"
}
