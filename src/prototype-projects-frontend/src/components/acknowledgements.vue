<template>
  <div class="acknowledgements">
    <div class="acknowledgements__header">
      <h2>Acknowledgements</h2>
      This list acknowledges any packages/tools used in this project which require that they be referenced.
    </div>
    <div class="acknowledgements__list">
      <ul>
        <li><a href="https://www.npmjs.com/package/file-system" target="_blank">file-system package</a></li>
        Copyright (c) 2004-2010 by Internet Systems Consortium, Inc. ("ISC") 
        Copyright (c) 1995-2003 by Internet Software Consortium

        Permission to use, copy, modify, and/or distribute this software for any purpose with or without fee is hereby granted, provided that the above copyright notice and this permission notice appear in all copies.
        <li><a href="https://www.npmjs.com/package/http" target="_blank">http package</a></li>
        Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
        Copyright (c) 2014 yuanyan. All rights reserved.
        THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
        <li><a href="https://github.com/vuejs-templates/webpack">webpack boilerplate used</a></li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Acknowledgements',
}
</script>

<style scoped lang="less">
  .acknowledgements {
    &__list {
      text-align: left;
    }
  }
</style>